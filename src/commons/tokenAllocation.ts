import { Balance, TokenAllocation, TransactionTokenAllocation } from '../../generated/schema';
import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { GIVBACK } from "../helpers/constants";

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

export function onGivBackPaid(txHash: string): void {
  const transactionTokenAllocations = TransactionTokenAllocation.load(txHash);
  if (!transactionTokenAllocations) {
    return;
  }
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
    balance.save();
  }
}
