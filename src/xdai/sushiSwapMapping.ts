import { SushiSwapLpToken, Sync } from '../../generated/SushiSwapLpToken/SushiSwapLpToken';
import { Address } from '@graphprotocol/graph-ts/index';
import { uniswapV3Pool } from '../../generated/uniswapV3Pool/uniswapV3Pool';
import { Price } from '../../generated/schema';

export function handleSync(event: Sync): void {
  updateTokenPrice();
}
function updateTokenPrice(): void {
  const sushiSwapContractAddress = Address.fromString('0x8C77Ba1d90C57D584aEEd57bC9B55258B8BE3438');
  const contract = SushiSwapLpToken.bind(sushiSwapContractAddress);
  const tokensResult = contract.try_getReserves();
  if (tokensResult.reverted) {
    return;
  }
  const source = 'sushiSwap';
  const eth = 'ETH';
  const giv = 'GIV';
  const priceId = `${source}-${eth}-${giv}`;

  let price = Price.load(priceId);
  if (!price) {
    price = new Price(priceId);
    price.source = source;
    price.from = eth;
    price.to = giv;
  }
  price.value = tokensResult.value.value0.div(tokensResult.value.value1);
  price.blockTimeStamp = tokensResult.value.value2;
  price.save();
}
