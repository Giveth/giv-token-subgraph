import {
  IncreaseLiquidity,
  UniswapV3PositionsNFT,
  Transfer,
  DecreaseLiquidity,
} from '../../../generated/UniswapV3PositionsNFT/UniswapV3PositionsNFT';
import { UniswapPosition } from '../../../generated/schema';
import { MAINNET_GIV_TOKEN_ADDRESS, MAINNET_WETH_TOKEN_ADDRESS } from '../../configuration';
import { BigInt } from '@graphprotocol/graph-ts';
import { Address } from '@graphprotocol/graph-ts/common/numbers';

const fee: i32 = 3000;

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  changeLiquidity(event.params.tokenId, event.address);
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  changeLiquidity(event.params.tokenId, event.address);
}

function changeLiquidity(tokenId: BigInt, contractAddress: Address): void {
  const contract = UniswapV3PositionsNFT.bind(contractAddress);
  const positions = contract.positions(tokenId);
  const token0 = positions.value2.toHex();
  const token1 = positions.value3.toHex();

  //value4 is fee
  if (positions.value4 == fee && isGivethLiquidity(token0, token1)) {
    const owner = contract.ownerOf(tokenId).toHex();
    let uniswapStakedPosition = UniswapPosition.load(tokenId.toHex());
    if (!uniswapStakedPosition) {
      uniswapStakedPosition = new UniswapPosition(tokenId.toHex());
    }
    uniswapStakedPosition.tokenId = tokenId.toHex();
    uniswapStakedPosition.liquidity = positions.value7;
    uniswapStakedPosition.token0 = token0;
    uniswapStakedPosition.token1 = token1;
    uniswapStakedPosition.tokenURI = contract.tokenURI(tokenId);
    uniswapStakedPosition.tickLower = positions.value5.toString();
    uniswapStakedPosition.tickUpper = positions.value6.toString();
    uniswapStakedPosition.owner = owner;
    uniswapStakedPosition.save();
  }
}

function isGivethLiquidity(token0: string, token1: string): boolean {
  return (
    (token0 == MAINNET_GIV_TOKEN_ADDRESS.toLowerCase() && token1 == MAINNET_WETH_TOKEN_ADDRESS.toLowerCase()) ||
    (token0 == MAINNET_WETH_TOKEN_ADDRESS.toLowerCase() && token1 == MAINNET_GIV_TOKEN_ADDRESS.toLowerCase())
  );
}

export function handleTransfer(event: Transfer): void {
  const position = UniswapPosition.load(event.params.tokenId.toString());
  if (!position) {
    return;
  }
  position.owner = event.params.to.toHex();
  position.save();
}
