import { TokenStaked, TokenUnstaked, UniswapV3Staker } from '../../../generated/uniswapV3Staker/UniswapV3Staker';
import { UniswapPosition } from '../../../generated/schema';

const uniswapRewardTokenIncentiveId = '0x14f30cf10656119fdc16cd3095dcf64a9a5e38e8404ecaa39341a813e37350d2';

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
}

export function handleTokenUnstaked(event: TokenUnstaked): void {
  const incentiveId = event.params.incentiveId.toHex();
  if (incentiveId == uniswapRewardTokenIncentiveId) {
    const uniswapStakedPosition = UniswapPosition.load(event.params.tokenId.toString());
    if (!uniswapStakedPosition) {
      return;
    }
    uniswapStakedPosition.staked = false;
    uniswapStakedPosition.staker = null;
    uniswapStakedPosition.save();
  }
}
