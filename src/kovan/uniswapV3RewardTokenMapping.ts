import {
  Approval,
  OwnershipTransferred,
  RewardPaid,
  Transfer,
} from '../../generated/UniswapV3RewardToken/UniswapV3RewardToken';
import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import { Address } from '@graphprotocol/graph-ts/index';

const contractAddress = Address.fromString('0x6F0ACC66600e8FD1b7eD2B3eC1208D56A53Da4ac');
export function handleRewardPaid(event: RewardPaid): void {
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), 'uniswapPool');
}

export function handleApproval(event: Approval): void {}
export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
export function handleTransfer(event: Transfer): void {}
