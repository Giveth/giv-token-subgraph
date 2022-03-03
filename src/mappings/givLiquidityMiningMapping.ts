import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/GivLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import { onRewardAdded, onRewardPaid, onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { GIV_LM } from '../helpers/constants';
import { onStaked, onWithdraw } from '../commons/balanceHandler';

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(event.address, event.transaction.hash.toHex(), event.params.user.toHex(), GIV_LM);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(event.address, event.params.user.toHex(), GIV_LM);
  onStaked(event.params.user.toHex(), event.params.amount, GIV_LM);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(event.address, event.params.user.toHex(), GIV_LM);
  onWithdraw(event.params.user.toHex(), event.params.amount, GIV_LM);
}
