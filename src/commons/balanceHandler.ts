import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Balance } from '../../generated/schema';
import { ZERO_ADDRESS } from '../helpers/constants';
import { UnipoolTokenDistributor } from '../../generated/balancerLiquidityMiningTokenDistributor/UnipoolTokenDistributor';

export function updateBalance(from: string, to: string, value: BigInt): void {
  if (to != ZERO_ADDRESS) {
    let toBalance = Balance.load(to);
    if (!toBalance) {
      toBalance = new Balance(to);
      toBalance.balance = value;
    } else {
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

export function updateUniswapRewards(address: string, contractAddress: Address): void {
  const contract = UnipoolTokenDistributor.bind(contractAddress);
  const callResult = contract.try_rewards(Address.fromString(address));
  if (callResult.reverted) {
    return;
  }
  let balance = Balance.load(address);
  if (!balance) {
    balance = new Balance(address);
  }
  balance.rewardsUniswap = callResult.value;
  balance.save();
}
