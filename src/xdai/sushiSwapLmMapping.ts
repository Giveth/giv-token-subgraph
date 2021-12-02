import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/givETHUnipoolTokenDistributor/UnipoolTokenDistributor';
import { onRewardAdded, onRewardPaid, onRewardUpdated } from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts';
import { GIV_ETH } from '../helpers/constants';
import {
  updateSushiswapLpStakedBalanceAfterWithdrawal,
  updateSushiswapStakedBalanceAfterStake,
} from '../commons/balanceHandler';

const contractAddress = Address.fromString('0x2C4a1620B29D551B950e48eba3813e5B5b012A2f');

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(contractAddress);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(contractAddress, event.transaction.hash.toHex(), event.params.user.toHex(), GIV_ETH);
}

export function handleStaked(event: Staked): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), GIV_ETH);
  updateSushiswapStakedBalanceAfterStake(event.params.user.toHex(), event.params.amount);
}

export function handleWithdrawn(event: Withdrawn): void {
  onRewardUpdated(contractAddress, event.params.user.toHex(), GIV_ETH);
  updateSushiswapLpStakedBalanceAfterWithdrawal(event.params.user.toHex(), event.params.amount);
}
