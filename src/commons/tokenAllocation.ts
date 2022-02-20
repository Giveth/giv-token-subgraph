import { Balance, TokenAllocation, TransactionTokenAllocation } from '../../generated/schema';
import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { FOX_TOKEN_DISTRO, GIV_TOKEN_DISTRO, GIVBACK } from '../helpers/constants';
import { Allocate, ChangeAddress, TokenDistro } from '../../generated/TokenDistro/TokenDistro';
import { addAllocatedTokens } from './balanceHandler';

export function saveTokenAllocation(
  recipient: string,
  txHash: string,
  logIndex: BigInt,
  amount: BigInt,
  timestamp: BigInt
): void {
  let transactionTokenAllocations = TransactionTokenAllocation.load(txHash);
  if (!transactionTokenAllocations) {
    transactionTokenAllocations = new TransactionTokenAllocation(txHash);
  }
  const tokenAllocationIds = transactionTokenAllocations.tokenAllocationIds || [];
  const entityId = `${txHash}-${logIndex}`;
  const entity = new TokenAllocation(entityId);
  entity.amount = amount;
  entity.timestamp = timestamp;
  entity.recipient = recipient;
  entity.txHash = txHash;
  entity.save();
  tokenAllocationIds.push(entityId);
  transactionTokenAllocations.tokenAllocationIds = tokenAllocationIds;
  transactionTokenAllocations.save();
}

export function updateTokenAllocationDistributor(txHash: string, distributor: string): void {
  const transactionTokenAllocations = TransactionTokenAllocation.load(txHash);
  if (!transactionTokenAllocations) {
    return;
  }
  for (let i = 0; i < transactionTokenAllocations.tokenAllocationIds.length; i++) {
    const entity = TokenAllocation.load(transactionTokenAllocations.tokenAllocationIds[i]);
    if (!entity) {
      continue;
    }
    entity.distributor = distributor;
    entity.save();
  }
}

export function onAllocate(event: Allocate, tokenDistroType: string): void {
  if (tokenDistroType === GIV_TOKEN_DISTRO) {
    saveTokenAllocation(
      event.params.grantee.toHex(),
      event.transaction.hash.toHex(),
      event.transactionLogIndex,
      event.params.amount,
      event.block.timestamp
    );
  }
  addAllocatedTokens(event.params.grantee.toHex(), event.params.amount, tokenDistroType);
}

export function onChangeAddress(event: ChangeAddress, tokenDistroType: string): void {
  const oldBalance = Balance.load(event.params.oldAddress.toHex());
  if (!oldBalance) {
    log.debug('Change Address oldAddress {} balance is null!', [event.params.oldAddress.toHex()]);
    return;
  }
  let newBalance = Balance.load(event.params.newAddress.toHex());
  if (!newBalance) {
    newBalance = new Balance(event.params.newAddress.toHex());
  }

  if (tokenDistroType === GIV_TOKEN_DISTRO) {
    // New Address allocatedTokens amount should be zero
    newBalance.allocatedTokens = oldBalance.allocatedTokens;
    oldBalance.allocatedTokens = BigInt.zero();

    // New Address claimed amount should be zero
    newBalance.claimed = oldBalance.claimed;
    oldBalance.claimed = BigInt.zero();

    newBalance.givback = newBalance.givback.plus(oldBalance.givback);
    oldBalance.givback = BigInt.zero();

    newBalance.givbackLiquidPart = newBalance.givbackLiquidPart.plus(oldBalance.givbackLiquidPart);
    oldBalance.givbackLiquidPart = BigInt.zero();
  } else if (tokenDistroType === FOX_TOKEN_DISTRO) {
    // New Address allocatedTokens amount should be zero
    newBalance.foxAllocatedTokens = oldBalance.foxAllocatedTokens;
    oldBalance.foxAllocatedTokens = BigInt.zero();

    // New Address claimed amount should be zero
    newBalance.foxClaimed = oldBalance.foxClaimed;
    oldBalance.foxClaimed = BigInt.zero();
  } else {
    log.error('Token Distro Type is not defined {}', [tokenDistroType]);
  }

  oldBalance.save();
  newBalance.save();
}
