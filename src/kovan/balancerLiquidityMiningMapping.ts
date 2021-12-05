import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/balancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import {
  createUnipoolContractInfoIfNotExists,
  onRewardAdded,
  onRewardPaid,
  onRewardUpdated,
} from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts/index';
import { BALANCER_LIQUIDITY } from '../helpers/constants';
import {
  handleBalancerLpStaked,
  handleBalancerLpWithdrawal,
} from '../commons/balanceHandler';
const contractAddress = Address.fromString('0xA14149623488A79ecfd79E63Bb7F5EF2F661A624');

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(contractAddress);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(contractAddress, event.transaction.hash.toHex(), event.params.user.toHex(), BALANCER_LIQUIDITY);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), BALANCER_LIQUIDITY);
  handleBalancerLpStaked(event.params.user.toHex(), event.params.amount);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), BALANCER_LIQUIDITY);
  handleBalancerLpWithdrawal(event.params.user.toHex(), event.params.amount);
}
