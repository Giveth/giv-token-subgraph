import { UnipoolTokenDistributor } from '../../generated/givLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import { Address } from '@graphprotocol/graph-ts/common/numbers';
import { UnipoolContractInfo } from '../../generated/schema';
import { log } from '@graphprotocol/graph-ts';

// const isContractInfoInitiated: [string: boolean] = { hey: true };
export function createUnipoolContractInfoIfNotExists(address: Address): void {
  log.info('createUnipoolContractInfoIfNotExists() has been called: ' + address.toHex(), []);

  // if (isContractInfoInitiated[address.toHex()]) {
  //   return;
  // }
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (contractInfo) {
    return;
  }
  contractInfo = new UnipoolContractInfo(address.toHex());
  contractInfo.lastUpdateTime = contract.lastUpdateTime();
  const periodFinish = contract.try_periodFinish();
  if (!periodFinish.reverted) {
    contractInfo.periodFinish = contract.try_periodFinish().value;
  }
  contractInfo.rewardDistribution = contract.rewardDistribution().toHex();
  contractInfo.rewardPerTokenStored = contract.rewardPerTokenStored();
  contractInfo.rewardRate = contract.rewardRate();
  contractInfo.save();
  // isContractInfoInitiated[address.toHex()] = true;
}

export function updateContractInfo(address: Address): void {
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  contractInfo.lastUpdateTime = contract.lastUpdateTime();
  contractInfo.periodFinish = contract.periodFinish();
  contractInfo.rewardDistribution = contract.rewardDistribution().toHex();
  contractInfo.rewardPerTokenStored = contract.rewardPerTokenStored();
  contractInfo.rewardRate = contract.rewardRate();
  contractInfo.save();
}

export function updateRewardPerTokenStored(address: Address): void {
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  const callResult = contract.try_rewardPerTokenStored();
  log.info('createUnipoolContractInfoIfNotExists() callResult: ' + callResult.value.toString(), []);

  if (!callResult.reverted) {
    log.info('createUnipoolContractInfoIfNotExists() callResult is reverted ' + callResult.reverted.toString(), []);

    contractInfo.rewardPerTokenStored = callResult.value;
    contractInfo.save();
  }
}

export function updateRewardRate(address: Address): void {
  // rewardRate has been called in below line, but I couldn't find usage of notifyRewardAmount()
  // so I call it when I call rewardPerTokenStored
  // https://github.com/Giveth/giv-token-contracts/blob/develop/contracts/Distributors/UnipoolTokenDistributor.sol#L171-L186
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  const callResult = contract.try_rewardRate();
  if (!callResult.reverted) {
    contractInfo.rewardRate = callResult.value;
    contractInfo.save();
  }
}

export function updateRewardDistribution(address: Address): void {
  //TODO Should listen to setRewardDistribution call
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  const callResult = contract.try_rewardDistribution();
  if (!callResult.reverted) {
    contractInfo.rewardDistribution = callResult.value.toHex();
    contractInfo.save();
  }
}

export function updateLastUpdateDate(address: Address): void {
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  const callResult = contract.try_lastUpdateTime();
  if (!callResult.reverted) {
    contractInfo.lastUpdateTime = callResult.value;
    contractInfo.save();
  }
}

export function updatePeriodFinish(address: Address): void {
  //TODO value changes in notifyRewardAmount() function in contract, I dont know when should I change that
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  const callResult = contract.try_periodFinish();
  if (!callResult.reverted) {
    contractInfo.periodFinish = callResult.value;
    contractInfo.save();
  }
}
