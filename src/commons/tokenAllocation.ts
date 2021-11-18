import { TokenAllocation, TransactionTokenAllocation } from '../../generated/schema';
import { Address, BigInt, log } from '@graphprotocol/graph-ts';

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
      return;
    }
    entity.distributor = distributor;
    entity.save();
  }
}
