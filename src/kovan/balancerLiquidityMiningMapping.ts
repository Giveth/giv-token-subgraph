import {
  OwnershipTransferred,
  RewardAdded, RewardPaid, Staked, Withdrawn
} from "../../generated/balancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor";
import {updateTokenAllocationDistributor} from "../commons/tokenAllocation";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {

}

export function handleRewardAdded(event: RewardAdded): void {}

export function handleRewardPaid(event: RewardPaid): void {
   updateTokenAllocationDistributor( event.transaction.hash.toHex(),'balancerLM')
}

export function handleStaked(event: Staked): void {}

export function handleWithdrawn(event: Withdrawn): void {}
