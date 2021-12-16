import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/BalancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import {
  createUnipoolContractInfoIfNotExists,
  onRewardAdded,
  onRewardPaid,
  onRewardUpdated,
} from '../commons/unipoolTokenDistributorHandler';
import { BALANCER_LIQUIDITY } from '../helpers/constants';
import { handleBalancerLpStaked, handleBalancerLpWithdrawal } from '../commons/balanceHandler';

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  createUnipoolContractInfoIfNotExists(event.address);
}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(event.address, event.transaction.hash.toHex(), event.params.user.toHex(), BALANCER_LIQUIDITY);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(event.address, event.params.user.toHex(), BALANCER_LIQUIDITY);
  handleBalancerLpStaked(event.params.user.toHex(), event.params.amount);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(event.address, event.params.user.toHex(), BALANCER_LIQUIDITY);
  handleBalancerLpWithdrawal(event.params.user.toHex(), event.params.amount);
}
