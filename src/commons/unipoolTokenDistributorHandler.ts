import { UnipoolTokenDistributor } from '../../generated/givLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import { Address } from '@graphprotocol/graph-ts/common/numbers';
import { UnipoolContractInfo } from '../../generated/schema';

export function createContractInfoIfNotExists(address: Address): void {
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
  if (!callResult.reverted) {
    contractInfo.rewardPerTokenStored = callResult.value;
    contractInfo.save();
  }
}
