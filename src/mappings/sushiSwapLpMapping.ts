import { Sync } from '../../generated/SushiSwapLpToken/SushiSwapLpToken';
import { Pair } from '../../generated/schema';
import { Transfer } from '../../generated/GIV/GIV';
import { onTransfer } from '../commons/balanceHandler';
import { SUSHISWAP_LP } from '../helpers/constants';
import { UniswapV2Pair } from '../../generated/uniswapV2Pair/uniswapV2Pair';

export function handleTransfer(event: Transfer): void {
  onTransfer(event.params.from.toHex(), event.params.to.toHex(), event.params.value, SUSHISWAP_LP);
}

export function handleSync(event: Sync): void {
  const _reserve0 = event.params._reserve0;
  const _reserve1 = event.params._reserve1;

  let pair = Pair.load(event.address.toHex());
  if (!pair) {
    pair = new Pair(event.address.toHex());
    const contract = UniswapV2Pair.bind(event.address);
    pair.token0 = contract.token0().toHex();
    pair.token1 = contract.token1().toHex();
  }

  pair.reserve0 = _reserve0;
  pair.reserve1 = _reserve1;
  pair.save();
}
