import { UnipoolTokenDistributor } from '../../generated/givLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import { Address } from '@graphprotocol/graph-ts/common/numbers';
import { TokenDistroContractInfo } from '../../generated/schema';
import { TokenDistro } from '../../generated/TokenDistro/TokenDistro';

export function createTokenDistroContractInfoIfNotExists(address: Address): void {
  const contract = TokenDistro.bind(address);
  let contractInfo = TokenDistroContractInfo.load(address.toHex());
  if (contractInfo) {
    return;
  }
  contractInfo = new TokenDistroContractInfo(address.toHex());
  contractInfo.lockedAmount = contract.lockedAmount();
  contractInfo.cliffTime = contract.cliffTime();
  contractInfo.duration = contract.duration();
  contractInfo.initialAmount = contract.initialAmount();
  contractInfo.totalTokens = contract.totalTokens();
  contractInfo.save();
}

export function updateContractInfo(address: Address): void {}

export function updateRewardPerTokenStored(address: Address): void {}
