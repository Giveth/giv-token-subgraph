import { SushiSwapLpToken, Sync } from '../../generated/SushiSwapLpToken/SushiSwapLpToken';
import { Address } from '@graphprotocol/graph-ts/index';
import { Price } from '../../generated/schema';
import { Transfer } from '../../generated/GIV/GIV';
import { onTransfer } from '../commons/balanceHandler';
import { SUSHISWAP_LP } from '../helpers/constants';
import { SUSHISWAP_ETH_GIV } from '../configuration';

export function handleTransfer(event: Transfer): void {
  onTransfer(event.params.from.toHex(), event.params.to.toHex(), event.params.value, SUSHISWAP_LP);
}

export function handleSync(event: Sync): void {
  updateTokenPrice();
}

function updateTokenPrice(): void {
  const sushiSwapContractAddress = Address.fromString(SUSHISWAP_ETH_GIV);
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
