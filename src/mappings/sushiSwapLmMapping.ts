import { onRewardAdded, onRewardPaid, onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { GIV_ETH } from '../helpers/constants';
import { onSushiswapLpWithdrawal, onSushiswapStaked } from '../commons/balanceHandler';
import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/SushiSwapLm/UnipoolTokenDistributor';

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(event.address, event.transaction.hash.toHex(), event.params.user.toHex(), GIV_ETH);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(event.address, event.params.user.toHex(), GIV_ETH);
  onSushiswapStaked(event.params.user.toHex(), event.params.amount);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(event.address, event.params.user.toHex(), GIV_ETH);
  onSushiswapLpWithdrawal(event.params.user.toHex(), event.params.amount);
}
