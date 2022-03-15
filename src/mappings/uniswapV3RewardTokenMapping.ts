import {
  Approval,
  OwnershipTransferred,
  RewardPaid,
  Transfer,
} from '../../generated/UniswapV3RewardToken/UniswapV3RewardToken';
import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import { UNISWAP_POOL } from '../helpers/constants';

export function handleRewardPaid(event: RewardPaid): void {
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), UNISWAP_POOL);
}

export function handleApproval(event: Approval): void {}
export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
export function handleTransfer(event: Transfer): void {}
