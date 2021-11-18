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
import { saveTokenAllocation } from '../commons/tokenAllocation';
import { addAllocatedTokens, addClaimed } from '../commons/balanceHandler';
import { createContractInfoIfNotExists } from '../commons/unipoolTokenDistributorHandler';
import { Address } from '@graphprotocol/graph-ts/index';
import { log } from '@graphprotocol/graph-ts';
import {createTokenDistroContractInfoIfNotExists} from "../commons/TokenDistroHandler";
const contractAddress = Address.fromString('0x95c76AEaDf98dbD5ef6E2acD8308E563302AF2e3');

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
  createTokenDistroContractInfoIfNotExists(contractAddress)

}

export function handleGivBackPaid(event: GivBackPaid): void {
  createTokenDistroContractInfoIfNotExists(contractAddress)
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {

}

export function handleRoleGranted(event: RoleGranted): void {

}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleStartTimeChanged(event: StartTimeChanged): void {}

export function handleInitialize(call: InitializeCall): void {
  log.error(
    `TokenDistro handleInitialize() totalTokens:${call.inputs._totalTokens} _cliffPeriod:${call.inputs._cliffPeriod} _duration:${call.inputs._duration}`,
    []
  );
  createContractInfoIfNotExists(Address.fromString('0x95c76AEaDf98dbD5ef6E2acD8308E563302AF2e3'));
}
