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
  createUnipoolContractInfoIfNotExists,
  onRewardUpdated,
  updateLastUpdateDate,
  updateRewardPerTokenStored,
  updateRewardRate,
} from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts/index';
import { onRewardPaid, updateUniswapRewards } from '../commons/balanceHandler';
const contractAddress = Address.fromString('0x5dA8196427475C0026B465454156f0D31236C88B');

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
}

export function handleRewardAdded(event: RewardAdded): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(contractAddress, event.transaction.hash.toHex(), event.params.user.toHex(), 'balancerLM');
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex());
}
