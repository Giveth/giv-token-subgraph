import {
  Approval,
  OwnershipTransferred,
  RewardPaid,
  Transfer,
} from '../../generated/UniswapV3RewardToken/UniswapV3RewardToken';
import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import { createTokenDistroContractInfoIfNotExists } from '../commons/TokenDistroHandler';
import { Address } from '@graphprotocol/graph-ts/index';

const contractAddress = Address.fromString('0x6b66368EddB78E61179523cf21049af40f797F4E');
export function handleRewardPaid(event: RewardPaid): void {
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), 'uniswapPool');
}

export function handleApproval(event: Approval): void {
}
export function handleOwnershipTransferred(event: OwnershipTransferred): void {
}
export function handleTransfer(event: Transfer): void {
}
