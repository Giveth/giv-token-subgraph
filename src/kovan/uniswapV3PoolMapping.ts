import { Initialize, Swap } from '../../generated/uniswapV3Pool/uniswapV3Pool';
import { UniswapV3Pool } from '../../generated/schema';
import { BigInt, log } from '@graphprotocol/graph-ts';

export function handleInitialize(event: Initialize): void {
  const pool = new UniswapV3Pool(event.address.toHex());
  pool.sqrtPriceX96 = event.params.sqrtPriceX96;
  pool.tick = BigInt.fromI32(event.params.tick);
  pool.save();
}

export function handleSwap(event: Swap): void {
  const pool = UniswapV3Pool.load(event.address.toHex());
  if (!pool) {
    log.error('Swap event of UniswapV3Pool {} before initialization', [event.address.toHex()]);
    return;
  }
  pool.sqrtPriceX96 = event.params.sqrtPriceX96;
  pool.tick = BigInt.fromI32(event.params.tick);
  pool.save();
}
