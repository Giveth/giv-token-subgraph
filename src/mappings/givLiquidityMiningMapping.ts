import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/GivLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import {
  onRewardAdded,
  OnRewardAddedParams,
  onRewardPaid,
  onStaked,
  OnStakedParams,
  onWithdrawn,
  OnWithdrawnParams,
} from '../commons/unipoolTokenDistributorHandler';
import { GIV_LM } from '../helpers/constants';

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(
    new OnRewardAddedParams(event.address, GIV_LM, event.params.user.toHex(), event.transaction.hash.toHex())
  );
}

export function handleStaked(event: Staked): void {
  onStaked(new OnStakedParams(event.address, GIV_LM, event.params.user.toHex(), event.params.amount));
}

export function handleWithdrawn(event: Withdrawn): void {
  onWithdrawn(new OnWithdrawnParams(event.address, GIV_LM, event.params.user.toHex(), event.params.amount));
}
