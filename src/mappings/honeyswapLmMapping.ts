import { onRewardAdded, onRewardPaid, onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { GIV_HNY_LM } from '../helpers/constants';
import { onWithdraw, onStaked } from '../commons/balanceHandler';
import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/HoneyswapLm/UnipoolTokenDistributor';

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(event.address, event.transaction.hash.toHex(), event.params.user.toHex(), GIV_HNY_LM);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(event.address, event.params.user.toHex(), GIV_HNY_LM);
  onStaked(event.params.user.toHex(), event.params.amount, GIV_HNY_LM);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(event.address, event.params.user.toHex(), GIV_HNY_LM);
  onWithdraw(event.params.user.toHex(), event.params.amount, GIV_HNY_LM);
}
