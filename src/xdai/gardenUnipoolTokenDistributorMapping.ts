import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/GardenUnipoolTokenDistributor/GardenUnipoolTokenDistributor';
import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import { onRewardAdded, onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts';
import { GARDEN_POOL } from '../helpers/constants';
import { updateGivStakedBalanceAfterStake, updateGivStakedBalanceAfterWithdrawal } from '../commons/balanceHandler';
const contractAddress = Address.fromString('0x26F033515ce926658def0939A8D9a0592D0F5cc9');

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(contractAddress);
}

export function handleRewardPaid(event: RewardPaid): void {
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), GARDEN_POOL);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), GARDEN_POOL);
  updateGivStakedBalanceAfterStake(event.params.user.toHex(), event.params.amount);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), GARDEN_POOL);
  updateGivStakedBalanceAfterWithdrawal(event.params.user.toHex(), event.params.amount);
}
