import {TokenAllocation} from "../../generated/schema";
import {Address, BigInt} from "@graphprotocol/graph-ts";
import {log} from '@graphprotocol/graph-ts'

interface SaveAllocationType {
    amount: BigInt,
    address: Address,
    txHash: Address
    timestamp: BigInt
}

export function saveTokenAllocation(
    recipient: string,
    txHash: string,
    logIndex: BigInt,
    amount: BigInt,
    timestamp: BigInt): void {

    // const entity = new TokenAllocation(`${txHash}-${logIndex}`)
    const entity = new TokenAllocation(txHash)
    entity.amount = amount;
    entity.timestamp = timestamp;
    entity.recipient = recipient
    entity.save();
}

export function updateTokenAllocationDistributor(txHash: string, distributor: string): void {
    const entity = TokenAllocation.load(txHash)
    if (!entity) {
        log.error(`updateTokenAllocationDistributor(), tokenAllocation not found txHash: ${txHash}, distributor: ${distributor}`, [txHash, distributor])
        return
    }
    entity.distributor = distributor
    entity.save();
}
