import {updateTokenAllocationDistributor} from "../commons/tokenAllocation";
import {
    OwnershipTransferred,
    RewardAdded,
    RewardPaid, Staked, Withdrawn
} from "../../generated/givHNYUnipoolTokenDistributor/UnipoolTokenDistributor";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {

}

export function handleRewardAdded(event: RewardAdded): void {
}

export function handleRewardPaid(event: RewardPaid): void {
    updateTokenAllocationDistributor( event.transaction.hash.toHex(),'givHNYPool')
}

export function handleStaked(event: Staked): void {
}

export function handleWithdrawn(event: Withdrawn): void {
}
