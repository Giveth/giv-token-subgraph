import {
  IncreaseLiquidity,
  UniswapV3PositionsNFT,
  Transfer,
  DecreaseLiquidity,
} from '../../../generated/UniswapV3PositionsNFT/UniswapV3PositionsNFT';
import { UniswapInfinitePosition, UniswapPosition } from '../../../generated/schema';
import { MAINNET_GIV_TOKEN_ADDRESS, MAINNET_WETH_TOKEN_ADDRESS, networkUniswapV3Config } from '../../configuration';
import { BigInt, dataSource } from '@graphprotocol/graph-ts';
import { recordUniswapV3InfinitePositionReward } from '../../commons/uniswapV3RewardRecorder';

const network = dataSource.network();

const uniswapV3Config = network === 'kovan' ? networkUniswapV3Config.kovan : networkUniswapV3Config.mainnet;

const fee: i32 = 3000;

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  const tokenId = event.params.tokenId;
  const uniswapToken = UniswapPosition.load(tokenId.toString());
  if (uniswapToken) {
    uniswapToken.liquidity = uniswapToken.liquidity.plus(event.params.liquidity);
    uniswapToken.closed = false;
    uniswapToken.save();

    recordUniswapV3InfinitePositionReward(event.block.timestamp);
    return;
  }
  const contract = UniswapV3PositionsNFT.bind(event.address);
  const positions = contract.positions(tokenId);
  const token0 = positions.value2.toHex();
  const token1 = positions.value3.toHex();

  const isGivEthLiquidity: boolean =
    (token0 == MAINNET_GIV_TOKEN_ADDRESS.toLowerCase() && token1 == MAINNET_WETH_TOKEN_ADDRESS.toLowerCase()) ||
    (token0 == MAINNET_WETH_TOKEN_ADDRESS.toLowerCase() && token1 == MAINNET_GIV_TOKEN_ADDRESS.toLowerCase());

  //value4 is fee
  if (positions.value4 == fee && isGivEthLiquidity == true) {
    const owner = contract.ownerOf(tokenId).toHex();
    const uniswapStakedPosition = new UniswapPosition(tokenId.toString());
    uniswapStakedPosition.tokenId = tokenId.toString();
    uniswapStakedPosition.liquidity = positions.value7;
    uniswapStakedPosition.token0 = token0;
    uniswapStakedPosition.token1 = token1;
    uniswapStakedPosition.tokenURI = contract.tokenURI(tokenId);
    uniswapStakedPosition.tickLower = positions.value5;
    uniswapStakedPosition.tickUpper = positions.value6;
    uniswapStakedPosition.owner = owner;
    uniswapStakedPosition.closed = false;
    uniswapStakedPosition.save();

    if (uniswapV3Config.UNISWAP_INFINITE_POSITION == tokenId.toString()) {
      const uniswapInfinitePosition = new UniswapInfinitePosition(tokenId.toString());
      uniswapInfinitePosition.lastRewardAmount = BigInt.zero();
      uniswapInfinitePosition.lastUpdateTimeStamp = event.block.timestamp;
      uniswapInfinitePosition.save();
    } else {
      recordUniswapV3InfinitePositionReward(event.block.timestamp);
    }
  }
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  const tokenId = event.params.tokenId;
  const uniswapStakedPosition = UniswapPosition.load(tokenId.toString());
  if (!uniswapStakedPosition) {
    // In decrease we dont check token0, token1, we just check if we have it we know it's our NFT otherwise we do nothing
    return;
  }
  uniswapStakedPosition.liquidity = uniswapStakedPosition.liquidity.minus(event.params.liquidity);
  if (uniswapStakedPosition.liquidity.equals(BigInt.fromString('0'))) {
    uniswapStakedPosition.closed = true;
  }
  uniswapStakedPosition.save();

  recordUniswapV3InfinitePositionReward(event.block.timestamp);
}

export function handleTransfer(event: Transfer): void {
  const position = UniswapPosition.load(event.params.tokenId.toString());
  if (!position) {
    return;
  }
  position.owner = event.params.to.toHex();
  position.save();
}
