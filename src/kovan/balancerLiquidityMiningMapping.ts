import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/balancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import { InitializeCall } from '../../generated/givLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import {
  createUnipoolContractInfoIfNotExists, updateLastUpdateDate,
  updateRewardPerTokenStored, updateRewardRate
} from "../commons/unipoolTokenDistributorHandler";
import { Address } from '@graphprotocol/graph-ts/index';
const contractAddress = Address.fromString('0x5dA8196427475C0026B465454156f0D31236C88B');
export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
}

export function handleRewardAdded(event: RewardAdded): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
}

export function handleRewardPaid(event: RewardPaid): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), 'balancerLM');
}

export function handleStaked(event: Staked): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateRewardPerTokenStored(contractAddress);
  updateRewardRate(contractAddress);
  updateLastUpdateDate(contractAddress);
}

export function handleWithdrawn(event: Withdrawn): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateRewardPerTokenStored(contractAddress);
  updateRewardRate(contractAddress);
  updateLastUpdateDate(contractAddress);

}

export function handleInitialize(call: InitializeCall): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
}
