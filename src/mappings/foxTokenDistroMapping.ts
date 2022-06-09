import {
  Allocate,
  Assign,
  ChangeAddress,
  Claim,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  StartTimeChanged,
  DurationChanged,
} from '../../generated/TokenDistro/TokenDistro';
import { onAllocate, onChangeAddress } from '../commons/tokenAllocation';
import { addClaimed } from '../commons/balanceHandler';
import { createOrUpdateTokenDistroContractInfo } from '../commons/TokenDistroHandler';
import { FOX_TOKEN_DISTRO } from '../helpers/constants';

export function handleAllocate(event: Allocate): void {
  onAllocate(event, FOX_TOKEN_DISTRO);
}

export function handleAssign(event: Assign): void {
  createOrUpdateTokenDistroContractInfo(event.address);
}

export function handleChangeAddress(event: ChangeAddress): void {
  onChangeAddress(event, FOX_TOKEN_DISTRO);
}

export function handleClaim(event: Claim): void {
  addClaimed(event.params.grantee.toHex(), event.params.amount, FOX_TOKEN_DISTRO);
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleStartTimeChanged(event: StartTimeChanged): void {
  createOrUpdateTokenDistroContractInfo(event.address);
}

export function handleDurationChanged(event: DurationChanged): void {
  createOrUpdateTokenDistroContractInfo(event.address);
}
