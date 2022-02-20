import { onRewardAdded, onRewardPaid, onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { FOX_HNY_LIQUIDITY } from '../helpers/constants';
import { handleFoxHnyLpStaked, handleFoxHnyLpWithdrawal } from '../commons/balanceHandler';
import { RewardAdded, RewardPaid, Staked, Withdrawn } from '../../generated/FoxHnyLm/UnipoolTokenDistributor';

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(event.address, event.transaction.hash.toHex(), event.params.user.toHex(), FOX_HNY_LIQUIDITY);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(event.address, event.params.user.toHex(), FOX_HNY_LIQUIDITY);
  handleFoxHnyLpStaked(event.params.user.toHex(), event.params.amount);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(event.address, event.params.user.toHex(), FOX_HNY_LIQUIDITY);
  handleFoxHnyLpWithdrawal(event.params.user.toHex(), event.params.amount);
}
