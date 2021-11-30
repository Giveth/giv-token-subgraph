import {
  InitializeCall,
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  UnipoolTokenDistributor,
  Withdrawn,
} from '../../generated/givLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import {
  createUnipoolContractInfoIfNotExists,
  onRewardUpdated,
  updateRewardPerTokenStored,
  updateRewardRate,
} from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts';
const contractAddress = Address.fromString('0xE77D387b4be1076891868060c32E81BC3b89C730');

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
}

export function handleRewardAdded(event: RewardAdded): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
}

export function handleRewardPaid(event: RewardPaid): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), 'givLM');
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}
