import { UnipoolTokenDistributor } from '../../generated/GivLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import { UnipoolContractInfo } from '../../generated/schema';
import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { updateUserRewards, userStaked, userWithdrew } from './balanceHandler';
import { updateTokenAllocationDistributor } from './tokenAllocation';

export class OnRewardAddedParams {
  contractAddress: Address;
  distributor: string;
  txHash: string;
  userAddress: string;
  constructor(contractAddress: Address, distributor: string, userAddress: string, txHash: string) {
    this.contractAddress = contractAddress;
    this.distributor = distributor;
    this.userAddress = userAddress;
    this.txHash = txHash;
  }
}

export class OnStakedParams {
  contractAddress: Address;
  distributor: string;
  amount: BigInt;
  userAddress: string;
  constructor(contractAddress: Address, distributor: string, userAddress: string, amount: BigInt) {
    this.contractAddress = contractAddress;
    this.distributor = distributor;
    this.userAddress = userAddress;
    this.amount = amount;
  }
}

export class OnWithdrawnParams extends OnStakedParams {}

export function onRewardAdded(contractAddress: Address): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateRewardPerTokenStored(contractAddress);
  updateRewardRate(contractAddress);
  updatePeriodFinish(contractAddress);
  updateLastUpdateDate(contractAddress);
}

export function onRewardPaid(params: OnRewardAddedParams): void {
  const contractAddress = params.contractAddress;
  const txHash = params.txHash;
  const userAddress = params.userAddress;
  const distributor = params.distributor;
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateRewardPerTokenStored(contractAddress);
  updateLastUpdateDate(contractAddress);
  updateTokenAllocationDistributor(txHash, distributor);

  //TODO it should be different for any farm/contract
  updateUserRewards(userAddress, contractAddress, distributor);
}

export function onStaked(params: OnStakedParams): void {
  const contractAddress = params.contractAddress;
  const amount = params.amount;
  const userAddress = params.userAddress;
  const distributor = params.distributor;
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateLastUpdateDate(contractAddress);
  updateTotalSupply(contractAddress);
  updateRewardPerTokenStored(contractAddress);
  userStaked(userAddress, amount, distributor);
}

export function onWithdrawn(params: OnStakedParams): void {
  const contractAddress = params.contractAddress;
  const amount = params.amount;
  const userAddress = params.userAddress;
  const distributor = params.distributor;
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateLastUpdateDate(contractAddress);
  updateTotalSupply(contractAddress);
  updateRewardPerTokenStored(contractAddress);
  userWithdrew(userAddress, amount, distributor);
}

export function onRewardUpdated(contractAddress: Address, userAddress: string, contractName: string): void {
  createUnipoolContractInfoIfNotExists(contractAddress);
  updateRewardRate(contractAddress);
  updateLastUpdateDate(contractAddress);
  updateTotalSupply(contractAddress);
  updateRewardPerTokenStored(contractAddress);
  updateUserRewards(userAddress, contractAddress, contractName);
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
  contractInfo.totalSupply = contract.totalSupply();
  contractInfo.save();
}

function updateRewardPerTokenStored(address: Address): void {
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  const rewardPerTokenStored = contract.rewardPerTokenStored();

  contractInfo.rewardPerTokenStored = rewardPerTokenStored;
  contractInfo.save();
}

function updateRewardRate(address: Address): void {
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

function updateLastUpdateDate(address: Address): void {
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

function updateTotalSupply(address: Address): void {
  const contract = UnipoolTokenDistributor.bind(address);
  let contractInfo = UnipoolContractInfo.load(address.toHex());
  if (!contractInfo) {
    contractInfo = new UnipoolContractInfo(address.toHex());
  }
  const callResult = contract.try_totalSupply();
  if (!callResult.reverted) {
    contractInfo.totalSupply = callResult.value;
    contractInfo.save();
  }
}

function updatePeriodFinish(address: Address): void {
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
