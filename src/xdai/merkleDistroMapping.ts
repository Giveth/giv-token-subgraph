import {Claimed, OwnershipTransferred} from "../../generated/MerkleDistro/MerkleDistro";
import {updateTokenAllocationDistributor} from "../commons/tokenAllocation";


export function handleClaimed(event: Claimed): void {
  updateTokenAllocationDistributor( event.transaction.hash.toHex(),'merkleDistro')
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
