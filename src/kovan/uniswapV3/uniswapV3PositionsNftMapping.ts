import {
  IncreaseLiquidity,
  UniswapV3PositionsNFT,
} from '../../../generated/uniswapV3PositionsNFT/UniswapV3PositionsNFT';
import { UniswapPosition } from '../../../generated/schema';
import { log } from '@graphprotocol/graph-ts/index';

const fee: i32 = 3000;

const testGivToken = '0x03472537cb64652aa1224e4aaf6f33a34e73e877';
const testWETHTOken = '0xd0a1e359811322d97991e03f863a0c30c2cf029c';

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  const contract = UniswapV3PositionsNFT.bind(event.address);
  const tokenId = event.params.tokenId.toString();
  const positions = contract.positions(event.params.tokenId);
  const token0 = positions.value2.toHex();
  const token1 = positions.value3.toHex();
  const isGivEthLiquidity: boolean =
    (token0 == testGivToken && token1 == testWETHTOken) || (token0 == testWETHTOken && token1 == testGivToken);

  //value4 is fee
  if (positions.value4 == fee && isGivEthLiquidity == true) {
    const owner = contract.ownerOf(event.params.tokenId).toHex();
    const uniswapStakedPosition = new UniswapPosition(tokenId);
    uniswapStakedPosition.tokenId = tokenId;
    uniswapStakedPosition.liquidity = positions.value7;
    uniswapStakedPosition.tickLower = positions.value5.toString();
    uniswapStakedPosition.tickUpper = positions.value6.toString();
    uniswapStakedPosition.owner = owner;
    uniswapStakedPosition.save();
  }
}
