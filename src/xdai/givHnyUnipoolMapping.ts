import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/givHNYUnipoolTokenDistributor/UnipoolTokenDistributor';
import { onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts';
const contractAddress = Address.fromString('0x523e671E6922B10c6157b265195e24e687224Fd1');
export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {}

export function handleRewardPaid(event: RewardPaid): void {
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), 'givHNYPool');
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}
