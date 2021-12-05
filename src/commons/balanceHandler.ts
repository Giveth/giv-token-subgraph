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

  let originalFromValue: BigInt;

  switch (true) {
    case distributor === BALANCER_LP:
      toBalance.balancerLp = toBalance.balancerLp.plus(value);
      originalFromValue = fromBalance.balancerLp;
      fromBalance.balancerLp = fromBalance.balancerLp.minus(value);
      break;
    case distributor === SUSHISWAP_LP:
      toBalance.sushiswapLp = toBalance.sushiswapLp.plus(value);
      originalFromValue = fromBalance.sushiswapLp;
      fromBalance.sushiswapLp = fromBalance.sushiswapLp.minus(value);
      break;
    case distributor === HONEYSWAP_LP:
      toBalance.honeyswapLp = toBalance.honeyswapLp.plus(value);
      originalFromValue = fromBalance.honeyswapLp;
      fromBalance.honeyswapLp = fromBalance.honeyswapLp.minus(value);
      break;
    case distributor == null:
      toBalance.balance = toBalance.balance.plus(value);
      originalFromValue = fromBalance.balance;
      fromBalance.balance = fromBalance.balance.minus(value);
      break;
    default:
      return;
  }

  if (from != ZERO_ADDRESS && !originalFromValue) {
    log.error('From value was null in transferring {} from {}', [distributor ? distributor : 'GIV', from]);
    return;
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
  balance.balancerLpStaked = balance.balancerLpStaked.minus(withdrawnValue);
  balance.save();
}
export function onSushiswapStaked(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
  }
  balance.sushiSwapLpStaked = balance.sushiSwapLpStaked.plus(stakedValue);
  balance.save();
}
export function onSushiswapLpWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  balance.sushiSwapLpStaked.minus(withdrawnValue);
  balance.save();
}

export function onHoneyswapStaked(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
  }
  balance.honeyswapLpStaked = balance.honeyswapLpStaked.plus(stakedValue);

  balance.save();
}
export function onHoneyswapLpWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  balance.honeyswapLpStaked = balance.honeyswapLpStaked.minus(withdrawnValue);
  balance.save();
}

export function onGivStaked(userAddress: string, stakedValue: BigInt): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
  }
  balance.givStaked = balance.givStaked.plus(stakedValue);
  balance.save();
}
export function onGivWithdrawal(userAddress: string, withdrawnValue: BigInt): void {
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
  }
  toBalance.allocatedTokens = toBalance.allocatedTokens.plus(value);
  toBalance.save();
}

export function addClaimed(to: string, value: BigInt): void {
  let toBalance = Balance.load(to);
  if (!toBalance) {
    toBalance = new Balance(to);
  }
  toBalance.claimed = toBalance.claimed.plus(value);
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
