import { TokenStaked, TokenUnstaked, UniswapV3Staker } from '../../../generated/UniswapV3Staker/UniswapV3Staker';
import { UniswapPosition, UniswapV3Pool } from '../../../generated/schema';
import { UNISWAP_V3_INCENTIVE_ID, UNISWAP_V3_POOL_ADDRESS } from '../../configuration';

const uniswapRewardTokenIncentiveId = UNISWAP_V3_INCENTIVE_ID;

export function handleTokenStaked(event: TokenStaked): void {
  const incentiveId = event.params.incentiveId.toHex();
  if (incentiveId != uniswapRewardTokenIncentiveId) {
    return;
  }
  const contract = UniswapV3Staker.bind(event.address);
  let uniswapStakedPosition = UniswapPosition.load(event.params.tokenId.toString());
  if (!uniswapStakedPosition) {
    uniswapStakedPosition = new UniswapPosition(event.params.tokenId.toString());
  }

  const tokenId = event.params.tokenId;
  const staker = contract.deposits(tokenId).value0.toHex();
  uniswapStakedPosition.staked = true;
  uniswapStakedPosition.staker = staker;
  uniswapStakedPosition.tokenId = tokenId.toString();
  uniswapStakedPosition.save();

  const pool = UniswapV3Pool.load(UNISWAP_V3_POOL_ADDRESS);
  if (pool) {
    pool.stakedLiquidity = pool.stakedLiquidity.plus(uniswapStakedPosition.liquidity);
    pool.save();
  }
}

export function handleTokenUnstaked(event: TokenUnstaked): void {
  const incentiveId = event.params.incentiveId.toHex();

  if (incentiveId != uniswapRewardTokenIncentiveId) {
    return;
  }

  const uniswapStakedPosition = UniswapPosition.load(event.params.tokenId.toString());
  if (!uniswapStakedPosition) {
    return;
  }
  uniswapStakedPosition.staked = false;
  uniswapStakedPosition.staker = null;
  uniswapStakedPosition.save();
  const pool = UniswapV3Pool.load(UNISWAP_V3_POOL_ADDRESS);

  if (pool) {
    pool.stakedLiquidity = pool.stakedLiquidity.minus(uniswapStakedPosition.liquidity);
    pool.save();
  }
}
