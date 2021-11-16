import { BigInt, log } from '@graphprotocol/graph-ts';
import { Balance } from '../../generated/schema';
import { ZERO_ADDRESS } from '../helpers/constants';

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
