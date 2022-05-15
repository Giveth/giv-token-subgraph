import {
  onRewardAdded,
  OnRewardAddedParams,
  onRewardPaid,
  onStaked,
  OnStakedParams,
  onWithdrawn,
  OnWithdrawnParams,
} from '../commons/unipoolTokenDistributorHandler';
import { ELK_GIV_LM } from '../helpers/constants';
import { RewardAdded, RewardPaid, Staked, Withdrawn } from '../../generated/FoxHnyLm/UnipoolTokenDistributor';

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(
    new OnRewardAddedParams(event.address, ELK_GIV_LM, event.params.user.toHex(), event.transaction.hash.toHex())
  );
}

export function handleStaked(event: Staked): void {
  onStaked(new OnStakedParams(event.address, ELK_GIV_LM, event.params.user.toHex(), event.params.amount));
}

export function handleWithdrawn(event: Withdrawn): void {
  onWithdrawn(new OnWithdrawnParams(event.address, ELK_GIV_LM, event.params.user.toHex(), event.params.amount));
}
