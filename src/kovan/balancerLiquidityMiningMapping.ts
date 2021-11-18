import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/balancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import { updateTokenAllocationDistributor } from '../commons/tokenAllocation';
import {InitializeCall} from "../../generated/givLiquidityMiningTokenDistributor/UnipoolTokenDistributor";
import {createContractInfoIfNotExists} from "../commons/unipoolTokenDistributorHandler";
import {Address} from "@graphprotocol/graph-ts/index";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardAdded(event: RewardAdded): void {}

export function handleRewardPaid(event: RewardPaid): void {
  updateTokenAllocationDistributor(event.transaction.hash.toHex(), 'balancerLM');
}

export function handleStaked(event: Staked): void {
}

export function handleWithdrawn(event: Withdrawn): void {}

export function handleInitialize(call: InitializeCall): void {
  createContractInfoIfNotExists(Address.fromString('0x5dA8196427475C0026B465454156f0D31236C88B'));
}
