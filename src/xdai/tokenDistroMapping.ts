import { saveTokenAllocation, updateTokenAllocationGivback } from "../commons/tokenAllocation";
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
}

export function handleGivBackPaid(event: GivBackPaid): void {
  updateTokenAllocationGivback(event.transaction.hash.toHex());
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleStartTimeChanged(event: StartTimeChanged): void {}
