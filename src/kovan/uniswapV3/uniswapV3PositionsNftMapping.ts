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
  log.error('handleIncreaseLiquidity() has been called: ' + event.params.tokenId.toString(), []);

  const contract = UniswapV3PositionsNFT.bind(event.address);
  const tokenId = event.params.tokenId.toString();
  const positions = contract.positions(event.params.tokenId);
  log.error('handleIncreaseLiquidity() step2 fee ' + positions.value4.toString(), []);
  const token0 = positions.value2.toHex();
  const token1 = positions.value3.toHex();
  const isGivEthLiquidity: boolean =
    (token0 == testGivToken && token1 == testWETHTOken) || (token0 == testWETHTOken && token1 == testGivToken);
  log.error('handleIncreaseLiquidity() step2 token0 ' + token0, []);
  log.error('handleIncreaseLiquidity() step3 token1 ' + token1, []);
  log.error('handleIncreaseLiquidity() step4 comparison ' + isGivEthLiquidity.toString(), []);
  log.error('handleIncreaseLiquidity() step5 fee comparison ' + (positions.value4 == fee).toString(), []);
  log.error(
    'handleIncreaseLiquidity() step6 isGivEthLiquidity == true comparison ' + (isGivEthLiquidity == true).toString(),
    []
  );

  //value4 is fee
  if (positions.value4 == fee && isGivEthLiquidity == true) {
    log.info('handleIncreaseLiquidity() step7', []);

    const uniswapStakedPosition = new UniswapPosition(tokenId);
    uniswapStakedPosition.tokenId = tokenId;
    uniswapStakedPosition.liquidity = positions.value7;
    uniswapStakedPosition.tickLower = positions.value5.toString();
    uniswapStakedPosition.tickUpper = positions.value6.toString();
    uniswapStakedPosition.save();
  }
}
