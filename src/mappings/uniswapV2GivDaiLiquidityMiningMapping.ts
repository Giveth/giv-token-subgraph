import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/UniswapV2GivDaiLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import {
  createUnipoolContractInfoIfNotExists,
  onRewardAdded,
  onRewardPaid,
  onRewardUpdated,
} from '../commons/unipoolTokenDistributorHandler';
import { UNISWAP_V2_GIV_DAI_LM } from '../helpers/constants';
import { onWithdraw, onStaked } from '../commons/balanceHandler';

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  createUnipoolContractInfoIfNotExists(event.address);
}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(event.address, event.transaction.hash.toHex(), event.params.user.toHex(), UNISWAP_V2_GIV_DAI_LM);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(event.address, event.params.user.toHex(), UNISWAP_V2_GIV_DAI_LM);
  onStaked(event.params.user.toHex(), event.params.amount, UNISWAP_V2_GIV_DAI_LM);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(event.address, event.params.user.toHex(), UNISWAP_V2_GIV_DAI_LM);
  onWithdraw(event.params.user.toHex(), event.params.amount, UNISWAP_V2_GIV_DAI_LM);
}
