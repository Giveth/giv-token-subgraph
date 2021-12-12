import { Initialize, Swap, UniswapV3Pool } from '../../../generated/uniswapV3Pool/uniswapV3Pool';
import { UniswapV3Pool as Pool } from '../../../generated/schema';
import { BigInt, log } from '@graphprotocol/graph-ts';

export function handleInitialize(event: Initialize): void {
  const poolContract = UniswapV3Pool.bind(event.address);
  const liquidity = poolContract.liquidity();
  const pool = new Pool(event.address.toHex());
  pool.sqrtPriceX96 = event.params.sqrtPriceX96;
  pool.tick = BigInt.fromI32(event.params.tick);
  pool.liquidity = liquidity;
  pool.save();
}

export function handleSwap(event: Swap): void {
  const pool = Pool.load(event.address.toHex());
  if (!pool) {
    log.error('Swap event of UniswapV3Pool {} before initialization', [event.address.toHex()]);
    return;
  }
  pool.sqrtPriceX96 = event.params.sqrtPriceX96;
  pool.tick = BigInt.fromI32(event.params.tick);
  pool.liquidity = event.params.liquidity;
  pool.save();
}
