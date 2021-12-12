import { TokenStaked, TokenUnstaked, UniswapV3Staker } from '../../generated/uniswapV3Staker/UniswapV3Staker';
import { UniswapPosition } from "../../generated/schema";

const uniswapRewardTokenIncentiveId = '0x14f30cf10656119fdc16cd3095dcf64a9a5e38e8404ecaa39341a813e37350d2';

export function handleTokenStaked(event: TokenStaked): void {
  const incentiveId = event.params.incentiveId.toHex();
  if (incentiveId == uniswapRewardTokenIncentiveId) {
    const contract = UniswapV3Staker.bind(event.address);
    const tokenId = event.params.tokenId;
    const walletAddress = contract.deposits(tokenId).value0.toHex();
    const uniswapStakedPosition = new UniswapPosition(event.params.tokenId.toString());
    uniswapStakedPosition.staked = true;
    uniswapStakedPosition.tokenId = tokenId.toString();
    uniswapStakedPosition.walletAddress = walletAddress;
    uniswapStakedPosition.save();
  }
}

export function handleTokenUnstaked(event: TokenUnstaked): void {
  const incentiveId = event.params.incentiveId.toHex();
  if (incentiveId == uniswapRewardTokenIncentiveId) {
    const uniswapStakedPosition = UniswapPosition.load(event.params.tokenId.toString());
    if (!uniswapStakedPosition) {
      return;
    }
    uniswapStakedPosition.staked = false;
    uniswapStakedPosition.save();
  }
}
