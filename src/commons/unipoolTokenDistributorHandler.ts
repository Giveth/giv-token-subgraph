import { UnipoolTokenDistributor } from '../../generated/givLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import { UnipoolContractInfo } from '../../generated/schema';
import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { updateRewards } from './balanceHandler';
import { updateTokenAllocationDistributor } from './tokenAllocation';

export function onRewardUpdated(contractAddress: Address, userAddress: string, contractName: string): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateRewardRate(contractAddress);
  updateLastUpdateDate(contractAddress);
  const rewardPerTokenStored = updateRewardPerTokenStored(contractAddress);
  updateRewards(userAddress, contractAddress, contractName, rewardPerTokenStored);
}

export function onRewardAdded(contractAddress: Address): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateRewardPerTokenStored(contractAddress);
  updateRewardRate(contractAddress);
  updateLastUpdateDate(contractAddress);
}

export function onRewardPaid(contractAddress: Address, txHash: string, userAddress: string, distributor: string): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateTokenAllocationDistributor(txHash, distributor);

  //TODO it should be different for any farm/contract
  updateRewards(userAddress, contractAddress, distributor);
}

// const isContractInfoInitiated: [string: boolean] = { hey: true };
export function createUnipoolContractInfoIfNotExists(address: Address): void {
  log.info('createUnipoolContractInfoIfNotExists() has been called: ' + address.toHex(), []);
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (contractInfo) {
    return;
  }
  contractInfo = new UnipoolContractInfo(address.toHex());
  contractInfo.lastUpdateTime = contract.lastUpdateTime();
  contractInfo.periodFinish = contract.periodFinish();
  contractInfo.rewardPerTokenStored = contract.rewardPerTokenStored();
  contractInfo.rewardRate = contract.rewardRate();
  contractInfo.save();
}

export function updateContractInfo(address: Address): void {
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  contractInfo.lastUpdateTime = contract.lastUpdateTime();
  contractInfo.periodFinish = contract.periodFinish();
  contractInfo.rewardPerTokenStored = contract.rewardPerTokenStored();
  contractInfo.rewardRate = contract.rewardRate();
  contractInfo.save();
}

export function updateRewardPerTokenStored(address: Address): BigInt | null {
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  const rewardPerTokenStored = contract.rewardPerTokenStored();

  contractInfo.rewardPerTokenStored = rewardPerTokenStored;
  contractInfo.save();
  return rewardPerTokenStored;
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
