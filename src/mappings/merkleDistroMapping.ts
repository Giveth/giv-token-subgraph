import { Claimed, OwnershipTransferred } from '../../generated/MerkleDistro/MerkleDistro';
import { Balance } from '../../generated/schema';

export function handleClaimed(event: Claimed): void {
  const balance = Balance.load(event.params.recipient.toHex());
  if (balance) {
    balance.givDropClaimed = true;
    balance.save();
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
