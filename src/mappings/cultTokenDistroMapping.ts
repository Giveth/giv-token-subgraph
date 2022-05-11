import {
  Allocate,
  Assign,
  ChangeAddress,
  Claim,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  StartTimeChanged,
} from '../../generated/TokenDistro/TokenDistro';
import { onAllocate, onChangeAddress } from '../commons/tokenAllocation';
import { addClaimed } from '../commons/balanceHandler';
import { createTokenDistroContractInfoIfNotExists } from '../commons/TokenDistroHandler';
import { CULT_TOKEN_DISTRO } from '../helpers/constants';

export function handleAllocate(event: Allocate): void {
  onAllocate(event, CULT_TOKEN_DISTRO);
}

export function handleAssign(event: Assign): void {
  createTokenDistroContractInfoIfNotExists(event.address);
}

export function handleChangeAddress(event: ChangeAddress): void {
  onChangeAddress(event, CULT_TOKEN_DISTRO);
}

export function handleClaim(event: Claim): void {
  addClaimed(event.params.grantee.toHex(), event.params.amount, CULT_TOKEN_DISTRO);
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleStartTimeChanged(event: StartTimeChanged): void {}
