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
  TokenDistro,
} from '../../generated/TokenDistro/TokenDistro';
import { onAllocate, onChangeAddress } from '../commons/tokenAllocation';
import { addClaimed } from '../commons/balanceHandler';
import { createTokenDistroContractInfoIfNotExists } from '../commons/TokenDistroHandler';
import { Balance, TokenAllocation, TransactionTokenAllocation } from '../../generated/schema';
import { GIV_TOKEN_DISTRO, GIVBACK } from '../helpers/constants';

export function handleAllocate(event: Allocate): void {
  onAllocate(event, GIV_TOKEN_DISTRO);
}

export function handleAssign(event: Assign): void {
  createTokenDistroContractInfoIfNotExists(event.address);
}

export function handleChangeAddress(event: ChangeAddress): void {
  onChangeAddress(event, GIV_TOKEN_DISTRO);
}

export function handleClaim(event: Claim): void {
  addClaimed(event.params.grantee.toHex(), event.params.amount, GIV_TOKEN_DISTRO);
}

export function handleGivBackPaid(event: GivBackPaid): void {
  // onGivBackPaid(event.transaction.hash.toHex(), event.address);

  const transactionTokenAllocations = TransactionTokenAllocation.load(event.transaction.hash.toHex());

  if (!transactionTokenAllocations) {
    return;
  }

  const contract = TokenDistro.bind(event.address);
  const globallyClaimableNow = contract.try_globallyClaimableAt(event.block.timestamp);
  const totalTokens = contract.totalTokens();

  for (let i = 0; i < transactionTokenAllocations.tokenAllocationIds.length; i++) {
    const tokenAllocation = TokenAllocation.load(transactionTokenAllocations.tokenAllocationIds[i]);
    if (!tokenAllocation) {
      continue;
    }
    tokenAllocation.givback = true;
    tokenAllocation.distributor = GIVBACK;
    tokenAllocation.save();
    const balance = Balance.load(tokenAllocation.recipient);
    if (!balance) {
      continue;
    }

    balance.givback = balance.givback.plus(tokenAllocation.amount);

    if (!globallyClaimableNow.reverted) {
      balance.givbackLiquidPart = balance.givbackLiquidPart.plus(
        tokenAllocation.amount.times(globallyClaimableNow.value).div(totalTokens)
      );
    }

    balance.save();
  }
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleStartTimeChanged(event: StartTimeChanged): void {}
