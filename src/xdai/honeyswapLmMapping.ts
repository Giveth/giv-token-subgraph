import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/givHNYUnipoolTokenDistributor/UnipoolTokenDistributor';
import { onRewardAdded, onRewardPaid, onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts';
import { GIV_HNY } from '../helpers/constants';
import {
  updateHoneyswapLpStakedBalanceAfterWithdrawal,
  updateHoneyswapStakedBalanceAfterStake,
} from '../commons/balanceHandler';
const contractAddress = Address.fromString('0x523e671E6922B10c6157b265195e24e687224Fd1');

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(contractAddress);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(contractAddress, event.transaction.hash.toHex(), event.params.user.toHex(), GIV_HNY);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), GIV_HNY);
  updateHoneyswapStakedBalanceAfterStake(event.params.user.toHex(), event.params.amount);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), GIV_HNY);
  updateHoneyswapLpStakedBalanceAfterWithdrawal(event.params.user.toHex(), event.params.amount);
}
