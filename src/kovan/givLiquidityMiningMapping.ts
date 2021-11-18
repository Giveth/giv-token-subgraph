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
import {createContractInfoIfNotExists, updateRewardPerTokenStored} from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts';
const contractAddress = Address.fromString('0x61296aEC102bE83Aaa350B408b5F6B9466F86Dd9');

let isContractInitialized = false;
export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const contract = UnipoolTokenDistributor.bind(event.address);
}

export function handleRewardAdded(event: RewardAdded): void {}

export function handleRewardPaid(event: RewardPaid): void {
  if (!isContractInitialized) {
    isContractInitialized = true;
    createContractInfoIfNotExists(contractAddress);
  }
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), 'givLM');
}

export function handleStaked(event: Staked): void {
  updateRewardPerTokenStored(contractAddress);
}

export function handleWithdrawn(event: Withdrawn): void {
  updateRewardPerTokenStored(contractAddress);
}

export function handleInitialize(call: InitializeCall): void {
  createContractInfoIfNotExists(contractAddress);
}
