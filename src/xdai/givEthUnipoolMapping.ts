import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/givETHUnipoolTokenDistributor/UnipoolTokenDistributor';
import { onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts';

const contractAddress = Address.fromString('0x2C4a1620B29D551B950e48eba3813e5B5b012A2f');
export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {}

export function handleRewardPaid(event: RewardPaid): void {
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), 'uniswapPool');
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}
