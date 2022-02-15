import { UniswapInfinitePosition } from '../../generated/schema';
import { IUniswapV3Config, networkUniswapV3Config } from '../configuration';
import {
  UniswapV3Staker,
  UniswapV3Staker__getRewardInfoInputKeyStruct,
} from '../../generated/UniswapV3Staker/UniswapV3Staker';
import { Address, BigInt, ethereum, log, dataSource } from '@graphprotocol/graph-ts';

class UniswapV3IncentiveKey extends UniswapV3Staker__getRewardInfoInputKeyStruct {
  constructor(tuple: Array<ethereum.Value>) {
    super();

    for (let i = 0; i < tuple.length; i++) {
      this[i] = tuple[i];
    }
    // this[0] = tuple[0];
    // this[1] = tuple[1];
    // this[2] = tuple[2];
    // this[3] = tuple[3];
    // this[4] = tuple[4];
  }
}

const network = dataSource.network();

const uniswapV3Config: IUniswapV3Config =
  network == 'kovan' ? networkUniswapV3Config.kovan : networkUniswapV3Config.mainnet;

const UNISWAP_V3_INCENTIVE: Array<ethereum.Value> = [
  ethereum.Value.fromAddress(Address.fromString(uniswapV3Config.UNISWAP_V3_REWARD_TOKEN)),
  ethereum.Value.fromAddress(Address.fromString(uniswapV3Config.UNISWAP_V3_POOL_ADDRESS)),
  ethereum.Value.fromUnsignedBigInt(BigInt.fromString(uniswapV3Config.INCENTIVE_START_TIME)),
  ethereum.Value.fromUnsignedBigInt(BigInt.fromString(uniswapV3Config.INCENTIVE_END_TIME)),
  ethereum.Value.fromAddress(Address.fromString(uniswapV3Config.INCENTIVE_REFUNDEE_ADDRESS)),
];

const intensiveKey = new UniswapV3IncentiveKey(UNISWAP_V3_INCENTIVE);

export function recordUniswapV3InfinitePositionReward(timestamp: BigInt): void {
  const position = UniswapInfinitePosition.load(uniswapV3Config.UNISWAP_INFINITE_POSITION);
  if (position) {
    const contract = UniswapV3Staker.bind(Address.fromString(uniswapV3Config.UNISWAP_V3_STAKER_ADDRESS));
    const result = contract.try_getRewardInfo(
      intensiveKey,
      BigInt.fromString(uniswapV3Config.UNISWAP_INFINITE_POSITION)
    );
    if (result.reverted) {
      log.error('getRewardInfo reverted!', []);
      return;
    }
    position.lastRewardAmount = result.value.value0;
    position.lastUpdateTimeStamp = timestamp;
    position.save();
  }
}
