import {
  Allocate,
  Assign,
  ChangeAddress,
  Claim,
  GivBackPaid,
  InitializeCall,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  StartTimeChanged,
} from '../../generated/TokenDistro/TokenDistro';
import { saveTokenAllocation, onGivBackPaid } from '../commons/tokenAllocation';
import { addAllocatedTokens, addClaimed } from '../commons/balanceHandler';
import { createUnipoolContractInfoIfNotExists } from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts/index';
import { log } from '@graphprotocol/graph-ts';
import { createTokenDistroContractInfoIfNotExists } from '../commons/TokenDistroHandler';
const contractAddress = Address.fromString('0x35f8414Ca6d5629887b9049cE99C7B592E583dd3');

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
  onGivBackPaid(event.transaction.hash.toHex());
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  createTokenDistroContractInfoIfNotExists(contractAddress);
}

export function handleRoleGranted(event: RoleGranted): void {
  createTokenDistroContractInfoIfNotExists(contractAddress);
}

export function handleRoleRevoked(event: RoleRevoked): void {
  createTokenDistroContractInfoIfNotExists(contractAddress);
}

export function handleStartTimeChanged(event: StartTimeChanged): void {
  createTokenDistroContractInfoIfNotExists(contractAddress);
}

export function handleInitialize(call: InitializeCall): void {
  log.error(
    `TokenDistro handleInitialize() totalTokens:${call.inputs._totalTokens} _cliffPeriod:${call.inputs._cliffPeriod} _duration:${call.inputs._duration}`,
    []
  );
  createUnipoolContractInfoIfNotExists(contractAddress);
}
