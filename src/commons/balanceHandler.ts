import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Balance } from '../../generated/schema';
import {
  BALANCER_LM,
  BALANCER_LP,
  ELK_TOKEN_DISTRO,
  FOX_HNY_LM,
  ELK_GIV_LM,
  FOX_HNY_LP,
  ELK_GIV_LP,
  FOX_TOKEN_DISTRO,
  GIV_ETH_LM,
  GIV_HNY_LM,
  GIV_LM,
  GIV_TOKEN_DISTRO,
  HONEYSWAP_LP,
  SUSHISWAP_LP,
  ZERO_ADDRESS,
  UNISWAP_V2_GIV_DAI_LP,
  UNISWAP_V2_GIV_DAI_LM,
  CULT_ETH_LP,
  CULT_ETH_LM,
  CULT_TOKEN_DISTRO,
  HONEYSWAP_GIV_DAI_LP,
  HONEYSWAP_GIV_DAI_LM,
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
    case distributor === UNISWAP_V2_GIV_DAI_LP:
      toBalance.uniswapV2GivDaiLp = toBalance.uniswapV2GivDaiLp.plus(value);
      originalFromValue = fromBalance.uniswapV2GivDaiLp;
      fromBalance.uniswapV2GivDaiLp = fromBalance.uniswapV2GivDaiLp.minus(value);
      break;
    case distributor === HONEYSWAP_GIV_DAI_LP:
      toBalance.honeyswapGivDaiLp = toBalance.honeyswapGivDaiLp.plus(value);
      originalFromValue = fromBalance.honeyswapGivDaiLp;
      fromBalance.honeyswapGivDaiLp = fromBalance.honeyswapGivDaiLp.minus(value);
      break;
    case distributor === CULT_ETH_LP:
      toBalance.cultEthLp = toBalance.cultEthLp.plus(value);
      originalFromValue = fromBalance.cultEthLp;
      fromBalance.cultEthLp = fromBalance.cultEthLp.minus(value);
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
    case distributor === FOX_HNY_LP:
      toBalance.foxHnyLp = toBalance.foxHnyLp.plus(value);
      originalFromValue = fromBalance.foxHnyLp;
      fromBalance.foxHnyLp = fromBalance.foxHnyLp.minus(value);
      break;
    case distributor === ELK_GIV_LP:
      toBalance.elkGivLp = toBalance.elkGivLp.plus(value);
      originalFromValue = fromBalance.elkGivLp;
      fromBalance.elkGivLp = fromBalance.elkGivLp.minus(value);
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

export function userStaked(userAddress: string, stakedValue: BigInt, contractName: string): void {
  let balance = Balance.load(userAddress);
  if (!balance) {
    log.error('User who stake should had some transfer events before', []);
    return;
  }

  switch (true) {
    case contractName === BALANCER_LM:
      balance.balancerLpStaked = balance.balancerLpStaked.plus(stakedValue);
      break;

    case contractName === UNISWAP_V2_GIV_DAI_LM:
      balance.uniswapV2GivDaiLpStaked = balance.uniswapV2GivDaiLpStaked.plus(stakedValue);
      break;

    case contractName === HONEYSWAP_GIV_DAI_LM:
      balance.honeyswapGivDaiLpStaked = balance.honeyswapGivDaiLpStaked.plus(stakedValue);
      break;

    case contractName === CULT_ETH_LM:
      balance.cultEthLpStaked = balance.cultEthLpStaked.plus(stakedValue);
      break;

    case contractName === GIV_ETH_LM:
      balance.sushiSwapLpStaked = balance.sushiSwapLpStaked.plus(stakedValue);
      break;

    case contractName === GIV_HNY_LM:
      balance.honeyswapLpStaked = balance.honeyswapLpStaked.plus(stakedValue);
      break;

    case contractName === GIV_LM:
      balance.givStaked = balance.givStaked.plus(stakedValue);
      break;

    case contractName === FOX_HNY_LM:
      balance.foxHnyLpStaked = balance.foxHnyLpStaked.plus(stakedValue);
      break;
    case contractName === ELK_GIV_LM:
      balance.elkGivLpStaked = balance.elkGivLpStaked.plus(stakedValue);
      break;
  }
  balance.save();
}

export function userWithdrew(userAddress: string, withdrawnValue: BigInt, contractName: string): void {
  const balance = Balance.load(userAddress);
  if (!balance) {
    return;
  }
  switch (true) {
    case contractName === BALANCER_LM:
      balance.balancerLpStaked = balance.balancerLpStaked.minus(withdrawnValue);
      break;
    case contractName === UNISWAP_V2_GIV_DAI_LM:
      balance.uniswapV2GivDaiLpStaked = balance.uniswapV2GivDaiLpStaked.minus(withdrawnValue);
      break;
    case contractName === HONEYSWAP_GIV_DAI_LM:
      balance.honeyswapGivDaiLpStaked = balance.honeyswapGivDaiLpStaked.minus(withdrawnValue);
      break;
    case contractName === CULT_ETH_LM:
      balance.cultEthLpStaked = balance.cultEthLpStaked.minus(withdrawnValue);
      break;
    case contractName === GIV_ETH_LM:
      balance.sushiSwapLpStaked = balance.sushiSwapLpStaked.minus(withdrawnValue);
      break;
    case contractName === GIV_HNY_LM:
      balance.honeyswapLpStaked = balance.honeyswapLpStaked.minus(withdrawnValue);
      break;
    case contractName === GIV_LM:
      balance.givStaked = balance.givStaked.minus(withdrawnValue);
      break;
    case contractName === FOX_HNY_LM:
      balance.foxHnyLpStaked = balance.foxHnyLpStaked.minus(withdrawnValue);
      break;
    case contractName === ELK_GIV_LM:
      balance.elkGivLpStaked = balance.elkGivLpStaked.minus(withdrawnValue);
      break;
  }
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
  } else if (tokenDistroType === CULT_TOKEN_DISTRO) {
    toBalance.cultAllocatedTokens = toBalance.cultAllocatedTokens.plus(value);
  } else if (tokenDistroType === ELK_TOKEN_DISTRO) {
    toBalance.elkAllocatedTokens = toBalance.elkAllocatedTokens.plus(value);
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
  } else if (tokenDistroType === CULT_TOKEN_DISTRO) {
    toBalance.cultClaimed = toBalance.cultClaimed.plus(value);
  } else if (tokenDistroType === ELK_TOKEN_DISTRO) {
    toBalance.elkClaimed = toBalance.elkClaimed.plus(value);
  } else {
    log.error('Token Distro Type is not defined {}', [tokenDistroType]);
  }
  toBalance.save();
}

export function updateUserRewards(userAddress: string, contractAddress: Address, distributor: string): void {
  const contract = UnipoolTokenDistributor.bind(contractAddress);
  const rewards = contract.rewards(Address.fromString(userAddress));
  const userRewardPerTokenPaid = contract.userRewardPerTokenPaid(Address.fromString(userAddress));
  let balance = Balance.load(userAddress);
  if (!balance) {
    balance = new Balance(userAddress);
  }
  switch (true) {
    case distributor === BALANCER_LM:
      balance.rewardPerTokenPaidBalancer = userRewardPerTokenPaid;
      balance.rewardsBalancer = rewards;
      break;
    case distributor === UNISWAP_V2_GIV_DAI_LM:
      balance.rewardPerTokenPaidUniswapV2GivDai = userRewardPerTokenPaid;
      balance.rewardsUniswapV2GivDai = rewards;
      break;
    case distributor === HONEYSWAP_GIV_DAI_LM:
      balance.rewardPerTokenPaidHoneyswapGivDai = userRewardPerTokenPaid;
      balance.rewardsHoneyswapGivDai = rewards;
      break;
    case distributor === CULT_ETH_LM:
      balance.rewardPerTokenPaidCultEthLm = userRewardPerTokenPaid;
      balance.rewardsCultEthLm = rewards;
      break;
    case distributor === GIV_ETH_LM:
      balance.rewardPerTokenPaidSushiSwap = userRewardPerTokenPaid;
      balance.rewardsSushiSwap = rewards;
      break;
    case distributor === GIV_HNY_LM:
      balance.rewardPerTokenPaidHoneyswap = userRewardPerTokenPaid;
      balance.rewardsHoneyswap = rewards;
      break;
    case distributor === GIV_LM:
      balance.rewardPerTokenPaidGivLm = userRewardPerTokenPaid;
      balance.rewardsGivLm = rewards;
      break;
    case distributor === FOX_HNY_LM:
      balance.rewardPerTokenPaidFoxHnyLm = userRewardPerTokenPaid;
      balance.rewardsFoxHnyLm = rewards;
      break;
    case distributor === ELK_GIV_LM:
      balance.rewardPerTokenPaidElkGivLm = userRewardPerTokenPaid;
      balance.rewardsElkGivLm = rewards;
      break;
  }
  balance.save();
}
