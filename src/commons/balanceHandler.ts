import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Balance } from '../../generated/schema';
import {
  BALANCER_LIQUIDITY,
  BALANCER_LP,
  GIV_ETH,
  GIV_HNY,
  GIV_LIQUIDITY,
  SUSHISWAP_LP,
  ZERO_ADDRESS,
} from '../helpers/constants';
import { UnipoolTokenDistributor } from '../../generated/balancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor';

export function updateBalance(from: string, to: string, value: BigInt, distributor: string | null = null): void {
  updateToBalance(to, value, distributor);
  updateFromBalance(from, value, distributor);
}

export function updateFromBalance(from: string, value: BigInt, distributor: string | null = null): void {
  if (from == ZERO_ADDRESS) {
    log.debug('is mint', []);
    return;
  }
  const fromBalance = Balance.load(from);
  if (!fromBalance) {
    log.error('Transferring from empty address: {}', [from]);
    return;
  }
  if (distributor === BALANCER_LP) {
    fromBalance.balancerLp = fromBalance.balancerLp.minus(value);
  } else if (distributor === SUSHISWAP_LP) {
    fromBalance.sushiswapLp = fromBalance.sushiswapLp.minus(value);
  } else {
    fromBalance.balance = fromBalance.balance.minus(value);
  }
  fromBalance.save();
}

export function updateToBalance(to: string, value: BigInt, distributor: string | null = null): void {
  if (to == ZERO_ADDRESS) {
    log.debug('is burn', []);
    return;
  }
  let toBalance = Balance.load(to);
  if (!toBalance) {
    toBalance = new Balance(to);
    if (distributor === BALANCER_LP) {
      toBalance.balancerLp = value;
    } else if (distributor === SUSHISWAP_LP) {
      toBalance.sushiswapLp = value;
    } else {
      toBalance.balance = value;
    }
  } else {
    //TODO delete this line, This is just for having some data and not be zero, for Cherik tests
    toBalance.givback = BigInt.fromString('1371');
    if (distributor === BALANCER_LP) {
      toBalance.balancerLp = toBalance.balancerLp.plus(value);
    } else if (distributor === SUSHISWAP_LP) {
      toBalance.sushiswapLp = toBalance.sushiswapLp.plus(value);
    } else {
      toBalance.balance = toBalance.balance.plus(value);
    }
  }
  toBalance.save();
}

export function updateBalancerLpStakedBalanceAfterStake(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
    balance.balancerLpStaked = stakedValue;
  } else {
    balance.balancerLpStaked.plus(stakedValue);
  }
  balance.save();
}
export function updateBalancerLpStakedBalanceAfterWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  balance.balancerLpStaked.minus(withdrawnValue);
  balance.save();
}
export function updateSushiswapStakedBalanceAfterStake(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
    balance.sushiSwapLpStaked = stakedValue;
  } else {
    balance.sushiSwapLpStaked.plus(stakedValue);
  }
  balance.save();
}
export function updateSushiswapLpStakedBalanceAfterWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  balance.sushiSwapLpStaked.minus(withdrawnValue);
  balance.save();
}

export function updateHoneyswapStakedBalanceAfterStake(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
    balance.honeyswapLpStaked = stakedValue;
  } else {
    balance.honeyswapLpStaked.plus(stakedValue);
  }
  balance.save();
}
export function updateHoneyswapLpStakedBalanceAfterWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  balance.honeyswapLpStaked.minus(withdrawnValue);
  balance.save();
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
