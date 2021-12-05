import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Balance } from '../../generated/schema';
import {
  BALANCER_LIQUIDITY,
  BALANCER_LP,
  GIV_ETH,
  GIV_HNY,
  GIV_LIQUIDITY,
  HONEYSWAP_LP,
  SUSHISWAP_LP,
  ZERO_ADDRESS,
} from '../helpers/constants';
import { UnipoolTokenDistributor } from '../../generated/balancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor';

export function onTransfer(from: string, to: string, value: BigInt, distributor: string | null = null): void {
  let toBalance = Balance.load(to);
  let fromBalance = Balance.load(from);

  if (!toBalance) {
    toBalance = new Balance(to);
  }
  if (!fromBalance) {
    if (from != ZERO_ADDRESS) {
      log.error('Transferring from empty address: {}', [from]);
      return;
    } else {
      fromBalance = new Balance(from);
    }
  }

  switch (true) {
    case distributor === BALANCER_LP:
      toBalance.balancerLp = toBalance.balancerLp ? toBalance.balancerLp.plus(value) : value;
      fromBalance.balancerLp = fromBalance.balancerLp ? fromBalance.balancerLp.minus(value) : BigInt.fromString('0');
      break;
    case distributor === SUSHISWAP_LP:
      toBalance.sushiswapLp = toBalance.sushiswapLp ? toBalance.sushiswapLp.plus(value) : value;
      fromBalance.sushiswapLp = fromBalance.sushiswapLp ? fromBalance.sushiswapLp.minus(value) : BigInt.fromString('0');
      break;
    case distributor === HONEYSWAP_LP:
      toBalance.honeyswapLp = toBalance.honeyswapLp ? toBalance.honeyswapLp.plus(value) : value;
      fromBalance.honeyswapLp = fromBalance.honeyswapLp ? fromBalance.honeyswapLp.minus(value) : BigInt.fromString('0');
      break;
    default:
      toBalance.balance = toBalance.balance ? toBalance.balance.plus(value) : value;
      fromBalance.balance = fromBalance.balance ? fromBalance.balance.minus(value) : BigInt.fromString('0');
  }

  if (from != ZERO_ADDRESS) {
    fromBalance.save();
  }

  if (to != ZERO_ADDRESS) {
    toBalance.save();
  }
}

export function handleBalancerLpStaked(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (balance) {
    balance.balancerLpStaked = balance.balancerLpStaked.plus(stakedValue);
    balance.save();
  } else {
    log.error('User who stake should had some transfer events before', []);
  }
}
export function handleBalancerLpWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  balance.balancerLpStaked.minus(withdrawnValue);
  balance.save();
}
export function handleSushiswapStaked(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
    balance.sushiSwapLpStaked = stakedValue;
  } else {
    balance.sushiSwapLpStaked.plus(stakedValue);
  }
  balance.save();
}
export function handleSushiswapLpWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  balance.sushiSwapLpStaked.minus(withdrawnValue);
  balance.save();
}

export function handleHoneyswapStaked(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
    balance.honeyswapLpStaked = stakedValue;
  } else {
    balance.honeyswapLpStaked = balance.honeyswapLpStaked.plus(stakedValue);
  }
  balance.save();
}
export function handleHoneyswapLpWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  balance.honeyswapLpStaked = balance.honeyswapLpStaked.minus(withdrawnValue);
  balance.save();
}

export function updateGivStakedBalanceAfterStake(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
    balance.givStaked = stakedValue;
  } else {
    balance.givStaked.plus(stakedValue);
  }
  balance.save();
}
export function updateGivStakedBalanceAfterWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  balance.givStaked.minus(withdrawnValue);
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
  switch (true) {
    case distributor === BALANCER_LIQUIDITY:
      balance.rewardPerTokenPaidBalancerLiquidity = rewardPerTokenStored;
      balance.rewardsBalancerLiquidity = rewards;
      break;
    case distributor === GIV_ETH:
      balance.rewardPerTokenPaidGivEth = rewardPerTokenStored;
      balance.rewardsGivEth = rewards;
      break;
    case distributor === GIV_HNY:
      balance.rewardPerTokenPaidGivHny = rewardPerTokenStored;
      balance.rewardsGivHny = rewards;
      break;
    case distributor === GIV_LIQUIDITY:
      balance.rewardPerTokenPaidGivLm = rewardPerTokenStored;
      balance.rewardsGivLm = rewards;
      break;
  }
  balance.save();
}
