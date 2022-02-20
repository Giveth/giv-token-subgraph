import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Balance } from '../../generated/schema';
import {
  BALANCER_LIQUIDITY,
  BALANCER_LP,
  FOX_TOKEN_DISTRO,
  GIV_ETH,
  GIV_HNY,
  GIV_LIQUIDITY,
  GIV_TOKEN_DISTRO,
  HONEYSWAP_LP,
  SUSHISWAP_LP,
  ZERO_ADDRESS,
} from '../helpers/constants';
import { UnipoolTokenDistributor } from '../../generated/BalancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor';

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
  balance.sushiSwapLpStaked = balance.sushiSwapLpStaked.minus(withdrawnValue);
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
  balance.givStaked = balance.givStaked.minus(withdrawnValue);
  balance.save();
}

export function addAllocatedTokens(to: string, value: BigInt, tokenDistroType: string): void {
  let toBalance = Balance.load(to);
  if (!toBalance) {
    toBalance = new Balance(to);
  }
  if (tokenDistroType === GIV_TOKEN_DISTRO) {
    toBalance.allocatedTokens = toBalance.allocatedTokens.plus(value);
    toBalance.allocationCount = toBalance.allocationCount.plus(BigInt.fromI32(1));
  } else if (tokenDistroType === FOX_TOKEN_DISTRO) {
    toBalance.foxAllocatedTokens = toBalance.foxAllocatedTokens.plus(value);
  } else {
    log.error('Token Distro Type is not defined {}', [tokenDistroType]);
  }
  toBalance.save();
}

export function addClaimed(to: string, value: BigInt, tokenDistroType: string): void {
  let toBalance = Balance.load(to);
  if (!toBalance) {
    toBalance = new Balance(to);
  }
  if (tokenDistroType === GIV_TOKEN_DISTRO) {
    toBalance.claimed = toBalance.claimed.plus(value);
    toBalance.givback = BigInt.zero();
    toBalance.givbackLiquidPart = BigInt.zero();
  } else if (tokenDistroType === FOX_TOKEN_DISTRO) {
    toBalance.foxClaimed = toBalance.foxClaimed.plus(value);
  } else {
    log.error('Token Distro Type is not defined {}', [tokenDistroType]);
  }
  toBalance.save();
}

export function updateRewards(userAddress: string, contractAddress: Address, distributor: string): void {
  const contract = UnipoolTokenDistributor.bind(contractAddress);
  const rewards = contract.rewards(Address.fromString(userAddress));
  const userRewardPerTokenPaid = contract.userRewardPerTokenPaid(Address.fromString(userAddress));
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
  }
  switch (true) {
    case distributor === BALANCER_LIQUIDITY:
      balance.rewardPerTokenPaidBalancer = userRewardPerTokenPaid;
      balance.rewardsBalancer = rewards;
      break;
    case distributor === GIV_ETH:
      balance.rewardPerTokenPaidSushiSwap = userRewardPerTokenPaid;
      balance.rewardsSushiSwap = rewards;
      break;
    case distributor === GIV_HNY:
      balance.rewardPerTokenPaidHoneyswap = userRewardPerTokenPaid;
      balance.rewardsHoneyswap = rewards;
      break;
    case distributor === GIV_LIQUIDITY:
      balance.rewardPerTokenPaidGivLm = userRewardPerTokenPaid;
      balance.rewardsGivLm = rewards;
      break;
  }
  balance.save();
}
