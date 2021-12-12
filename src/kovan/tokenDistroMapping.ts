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
import { saveTokenAllocation, onGivBackPaid } from '../commons/tokenAllocation';
import { addAllocatedTokens, addClaimed } from '../commons/balanceHandler';
import { createTokenDistroContractInfoIfNotExists } from '../commons/TokenDistroHandler';

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
  createTokenDistroContractInfoIfNotExists(event.address);
}

export function handleGivBackPaid(event: GivBackPaid): void {
  createTokenDistroContractInfoIfNotExists(event.address);
  onGivBackPaid(event.transaction.hash.toHex());
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  createTokenDistroContractInfoIfNotExists(event.address);
}

export function handleRoleGranted(event: RoleGranted): void {
  createTokenDistroContractInfoIfNotExists(event.address);
}

export function handleRoleRevoked(event: RoleRevoked): void {
  createTokenDistroContractInfoIfNotExists(event.address);
}

export function handleStartTimeChanged(event: StartTimeChanged): void {
  createTokenDistroContractInfoIfNotExists(event.address);
}
