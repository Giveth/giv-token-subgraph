import { onRewardAdded, onRewardPaid, onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { ELK_GIV_LM } from '../helpers/constants';
import { onStaked, onWithdraw } from '../commons/balanceHandler';
import { RewardAdded, RewardPaid, Staked, Withdrawn } from '../../generated/FoxHnyLm/UnipoolTokenDistributor';

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(event.address, event.transaction.hash.toHex(), event.params.user.toHex(), ELK_GIV_LM);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(event.address, event.params.user.toHex(), ELK_GIV_LM);
  onStaked(event.params.user.toHex(), event.params.amount, ELK_GIV_LM);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(event.address, event.params.user.toHex(), ELK_GIV_LM);
  onWithdraw(event.params.user.toHex(), event.params.amount, ELK_GIV_LM);
}
