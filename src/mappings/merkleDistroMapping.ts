import { Claimed, OwnershipTransferred } from '../../generated/MerkleDistro/MerkleDistro';
import { Balance } from '../../generated/schema';
import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import { GIVDROP } from '../helpers/constants';

export function handleClaimed(event: Claimed): void {
  const balance = Balance.load(event.params.recipient.toHex());
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), GIVDROP);

  if (balance) {
    balance.givDropClaimed = true;
    balance.save();
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
