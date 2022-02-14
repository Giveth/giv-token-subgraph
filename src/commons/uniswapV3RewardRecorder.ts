import { UniswapInfinitePosition } from '../../generated/schema';
import {
  INCENTIVE_END_TIME,
  INCENTIVE_REFUNDEE_ADDRESS,
  INCENTIVE_START_TIME,
  UNISWAP_INFINITE_POSITION,
  UNISWAP_V3_POOL_ADDRESS,
  UNISWAP_V3_REWARD_TOKEN,
  UNISWAP_V3_STAKER_ADDRESS,
} from '../configuration';
import {
  UniswapV3Staker,
  UniswapV3Staker__getRewardInfoInputKeyStruct,
} from '../../generated/UniswapV3Staker/UniswapV3Staker';
import { Address, BigInt, ethereum, log } from '@graphprotocol/graph-ts';

class UniswapV3IncentiveKey extends UniswapV3Staker__getRewardInfoInputKeyStruct {
  constructor(tuple: Array<ethereum.Value>) {
    super();

    this[0] = tuple[0];
    this[1] = tuple[1];
    this[2] = tuple[2];
    this[3] = tuple[3];
    this[4] = tuple[4];
  }
}

const UNISWAP_V3_INCENTIVE: Array<ethereum.Value> = [
  ethereum.Value.fromAddress(Address.fromString(UNISWAP_V3_REWARD_TOKEN)),
  ethereum.Value.fromAddress(Address.fromString(UNISWAP_V3_POOL_ADDRESS)),
  ethereum.Value.fromUnsignedBigInt(BigInt.fromString(INCENTIVE_START_TIME)),
  ethereum.Value.fromUnsignedBigInt(BigInt.fromString(INCENTIVE_END_TIME)),
  ethereum.Value.fromAddress(Address.fromString(INCENTIVE_REFUNDEE_ADDRESS)),
];

const intensiveKey = new UniswapV3IncentiveKey(UNISWAP_V3_INCENTIVE);

export function recordUniswapV3InfinitePositionReward(timestamp: BigInt): void {
  const position = UniswapInfinitePosition.load(UNISWAP_INFINITE_POSITION);
  if (position) {
    const contract = UniswapV3Staker.bind(Address.fromString(UNISWAP_V3_STAKER_ADDRESS));
    const result = contract.try_getRewardInfo(intensiveKey, BigInt.fromString(UNISWAP_INFINITE_POSITION));
    if (result.reverted) {
      log.error('getRewardInfo reverted!', []);
      return;
    }
    position.lastRewardAmount = result.value.value0;
    position.lastUpdateTimeStamp = timestamp;
    position.save();
  }
}
