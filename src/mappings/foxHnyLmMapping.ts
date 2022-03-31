import { onRewardAdded, onRewardPaid, onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { FOX_HNY_LM } from '../helpers/constants';
import { onStaked, onWithdraw } from '../commons/balanceHandler';
import { RewardAdded, RewardPaid, Staked, Withdrawn } from '../../generated/FoxHnyLm/UnipoolTokenDistributor';

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(event.address, event.transaction.hash.toHex(), event.params.user.toHex(), FOX_HNY_LM);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(event.address, event.params.user.toHex(), FOX_HNY_LM);
  onStaked(event.params.user.toHex(), event.params.amount, FOX_HNY_LM);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(event.address, event.params.user.toHex(), FOX_HNY_LM);
  onWithdraw(event.params.user.toHex(), event.params.amount, FOX_HNY_LM);
}
