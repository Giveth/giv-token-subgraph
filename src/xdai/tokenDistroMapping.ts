import { saveTokenAllocation, updateTokenAllocationGivback } from '../commons/tokenAllocation';
import {
  Allocate,
  Assign,
  ChangeAddress,
  Claim,
  GivBackPaid,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  StartTimeChanged,
} from '../../generated/TokenDistro/TokenDistro';
import { addAllocatedTokens, addClaimed } from '../commons/balanceHandler';
import { createTokenDistroContractInfoIfNotExists } from '../commons/TokenDistroHandler';
import { Address } from '@graphprotocol/graph-ts';
const contractAddress = Address.fromString('0x1aD46D40648639f84a396Fef32132888038c5aA8');

export function handleAllocate(event: Allocate): void {
  saveTokenAllocation(
    event.params.grantee.toHex(),
    event.transaction.hash.toHex(),
    event.transactionLogIndex,
    event.params.amount,
    event.block.timestamp
  );
  addAllocatedTokens(event.params.grantee.toHex(), event.params.amount);
}

export function handleAssign(event: Assign): void {}

export function handleChangeAddress(event: ChangeAddress): void {}

export function handleClaim(event: Claim): void {
  addClaimed(event.params.grantee.toHex(), event.params.amount);
  createTokenDistroContractInfoIfNotExists(contractAddress);
}

export function handleGivBackPaid(event: GivBackPaid): void {
  createTokenDistroContractInfoIfNotExists(contractAddress);
  updateTokenAllocationGivback(event.transaction.hash.toHex());
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  createTokenDistroContractInfoIfNotExists(contractAddress);
}

export function handleRoleGranted(event: RoleGranted): void {
  createTokenDistroContractInfoIfNotExists(contractAddress);
}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleStartTimeChanged(event: StartTimeChanged): void {}
