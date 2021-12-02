import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Balance } from "../../generated/schema";
import { BALANCER_LIQUIDITY, BALANCER_LP, GIV_ETH, GIV_HNY, GIV_LIQUIDITY, ZERO_ADDRESS } from "../helpers/constants";
import { UnipoolTokenDistributor } from "../../generated/balancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor";

export function updateBalance(from: string, to: string, value: BigInt, distributor: string): void {
  updateToBalance(to, value, distributor);
  updateFromBalance(from, value, distributor);
}

export function updateFromBalance(from: string, value: BigInt, distributor: string): void {
  if (from == ZERO_ADDRESS) {
    log.debug("is mint", []);
    return;
  }
  const fromBalance = Balance.load(from);
  if (!fromBalance) {
    log.error("Transferring from empty address: {}", [from]);
    return;
  }
  if (distributor === BALANCER_LP) {
    fromBalance.balancerLp = fromBalance.balancerLp.minus(value);
  } else {
    fromBalance.balance = fromBalance.balance.minus(value);
  }
  fromBalance.save();
}

export function updateToBalance(to: string, value: BigInt, distributor: string): void {
  if (to == ZERO_ADDRESS) {
    log.debug("is burn", []);
    return;
  }
  let toBalance = Balance.load(to);
  if (!toBalance) {
    toBalance = new Balance(to);
    if (distributor === BALANCER_LP) {
      toBalance.balancerLp = value;
    } else {
      toBalance.balance = value;
    }
  } else {
    //TODO delete this line, This is just for having some data and not be zero, for Cherik tests
    toBalance.givback = BigInt.fromString("1371");
    if (distributor === BALANCER_LP) {
      toBalance.balancerLp = toBalance.balancerLp.plus(value);
    } else {
      toBalance.balance = toBalance.balance.plus(value);
    }
  }
  toBalance.save();
}

export function addAllocatedTokens(to: string, value: BigInt): void {
  let toBalance = Balance.load(to);
  if (!toBalance) {
    toBalance = new Balance(to);
    toBalance.allocatedTokens = value;
  } else {
    toBalance.allocatedTokens = toBalance.allocatedTokens.plus(value);
  }
  toBalance.save();
}

export function addClaimed(to: string, value: BigInt): void {
  let toBalance = Balance.load(to);
  if (!toBalance) {
    toBalance = new Balance(to);
    toBalance.claimed = value;
  } else {
    toBalance.claimed = toBalance.claimed.plus(value);
  }
  toBalance.givback = BigInt.zero();
  toBalance.save();
}

export function updateRewards(
  address: string,
  contractAddress: Address,
  distributor: string,
  rewardPerTokenStored: BigInt | null = null
): void {
  const contract = UnipoolTokenDistributor.bind(contractAddress);
  const rewards = contract.rewards(Address.fromString(address));
  let balance = Balance.load(address);
  if (!balance) {
    balance = new Balance(address);
  }
  if (!rewardPerTokenStored) {
    balance.save();
    return;
  }
  if (distributor === BALANCER_LIQUIDITY) {
    balance.rewardPerTokenPaidBalancerLiquidity = rewardPerTokenStored;
    balance.rewardsBalancerLiquidity = rewards;
  } else if (distributor === GIV_ETH) {
    balance.rewardPerTokenPaidGivEth = rewardPerTokenStored;
    balance.rewardsGivEth = rewards;
  } else if (distributor === GIV_HNY) {
    balance.rewardPerTokenPaidGivHny = rewardPerTokenStored;
    balance.rewardsGivHny = rewards;
  } else if (distributor === GIV_LIQUIDITY) {
    balance.rewardPerTokenPaidGivLm = rewardPerTokenStored;
    balance.rewardsGivLm = rewards;
  }
  balance.save();
}
