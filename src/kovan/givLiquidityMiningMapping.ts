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
  onRewardAdded,
  onRewardPaid,
  onRewardUpdated,
  updateRewardPerTokenStored,
  updateRewardRate,
} from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts';
import { GIV_LIQUIDITY } from '../helpers/constants';
import { onGivStaked, onGivWithdrawal } from '../commons/balanceHandler';
const contractAddress = Address.fromString('0x1aAA619b066360C22EBD8c597c975CACff146317');

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(contractAddress);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(contractAddress, event.transaction.hash.toHex(), event.params.user.toHex(), GIV_LIQUIDITY);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), GIV_LIQUIDITY);
  onGivStaked(event.params.user.toHex(), event.params.amount);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), GIV_LIQUIDITY);
  onGivWithdrawal(event.params.user.toHex(), event.params.amount);
}
