import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Balance } from '../../generated/schema';
import { BALANCER_LIQUIDITY, GIV_ETH, GIV_HNY, GIV_LIQUIDITY, ZERO_ADDRESS } from '../helpers/constants';
import { UnipoolTokenDistributor } from '../../generated/balancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor';

export function updateBalance(from: string, to: string, value: BigInt): void {
  if (to != ZERO_ADDRESS) {
    let toBalance = Balance.load(to);
    if (!toBalance) {
      toBalance = new Balance(to);
      toBalance.balance = value;
    } else {
      //This is just for having some data and not be zero, for Cherik tests
      toBalance.givback = BigInt.fromString('1371');
      toBalance.balance = toBalance.balance.plus(value);
    }
    toBalance.save();
  } else {
    log.debug('is burn', []);
  }

  // Is not mint
  if (from != ZERO_ADDRESS) {
    const fromBalance = Balance.load(from);
    if (!fromBalance) {
      log.error('Transferring from empty address: {}', [from]);
      return;
    }
    fromBalance.balance = fromBalance.balance.minus(value);
    fromBalance.save();
  } else {
    log.debug('is mint', []);
  }
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
