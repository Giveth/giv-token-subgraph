import {
  IncreaseLiquidity,
  UniswapV3PositionsNFT,
  Transfer,
} from '../../../generated/UniswapV3PositionsNFT/UniswapV3PositionsNFT';
import { UniswapPosition } from '../../../generated/schema';
import { MAINNET_GIV_TOKEN_ADDRESS, MAINNET_WETH_TOKEN_ADDRESS } from '../../configuration';
import { log } from '@graphprotocol/graph-ts/index';

const fee: i32 = 3000;

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  const contract = UniswapV3PositionsNFT.bind(event.address);
  const tokenId = event.params.tokenId.toString();
  const positions = contract.positions(event.params.tokenId);
  const token0 = positions.value2.toHex();
  const token1 = positions.value3.toHex();

  const isGivEthLiquidity: boolean =
    (token0 == MAINNET_GIV_TOKEN_ADDRESS.toLowerCase() && token1 == MAINNET_WETH_TOKEN_ADDRESS.toLowerCase()) ||
    (token0 == MAINNET_WETH_TOKEN_ADDRESS.toLowerCase() && token1 == MAINNET_GIV_TOKEN_ADDRESS.toLowerCase());

  //value4 is fee
  if (positions.value4 == fee && isGivEthLiquidity == true) {
    const owner = contract.ownerOf(event.params.tokenId).toHex();
    const uniswapStakedPosition = new UniswapPosition(tokenId);
    uniswapStakedPosition.tokenId = tokenId;
    uniswapStakedPosition.liquidity = positions.value7;
    uniswapStakedPosition.token0 = token0;
    uniswapStakedPosition.token1 = token1;
    uniswapStakedPosition.tokenURI = contract.tokenURI(event.params.tokenId);
    uniswapStakedPosition.tickLower = positions.value5.toString();
    uniswapStakedPosition.tickUpper = positions.value6.toString();
    uniswapStakedPosition.owner = owner;
    uniswapStakedPosition.save();
  }
}

export function handleTransfer(event: Transfer): void {
  const position = UniswapPosition.load(event.params.tokenId.toString());
  if (!position) {
    return;
  }
  position.owner = event.params.to.toHex();
  position.save();
}
