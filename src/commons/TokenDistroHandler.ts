import { Address } from '@graphprotocol/graph-ts/common/numbers';
import { TokenDistroContractInfo } from '../../generated/schema';
import { TokenDistro } from '../../generated/TokenDistro/TokenDistro';
import { BigInt, log } from '@graphprotocol/graph-ts';

// const isContractInfoInitiated: any = {};

export function createTokenDistroContractInfoIfNotExists(address: Address): void {
  log.error('createTokenDistroContractInfoIfNotExists() has been called: ' + address.toHex(), []);
  // if (isContractInfoInitiated[address.toHex()]) {
  //   return;
  // }
  const contract = TokenDistro.bind(address);
  let contractInfo = TokenDistroContractInfo.load(address.toHex());
  if (contractInfo) {
    log.error('createTokenDistroContractInfoIfNotExists() contractInfo existed' + address.toHex(), []);

    return;
  }
  contractInfo = new TokenDistroContractInfo(address.toHex());
  contractInfo.lockedAmount = contract.lockedAmount();
  contractInfo.startTime = contract.startTime();
  contractInfo.cliffTime = contract.cliffTime();
  contractInfo.duration = contract.duration();
  contractInfo.initialAmount = contract.initialAmount();
  contractInfo.totalTokens = contract.totalTokens();
  contractInfo.save();
  // isContractInfoInitiated[address.toHex()] = true;
}

export function updateContractInfo(address: Address): void {}

export function updateRewardPerTokenStored(address: Address): void {}
