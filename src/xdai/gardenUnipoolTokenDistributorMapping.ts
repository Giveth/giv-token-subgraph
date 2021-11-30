import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/GardenUnipoolTokenDistributor/GardenUnipoolTokenDistributor';
import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import { onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts';
const contractAddress = Address.fromString('0x26F033515ce926658def0939A8D9a0592D0F5cc9');
export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {}

export function handleRewardPaid(event: RewardPaid): void {
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), 'gardenPool');
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}
