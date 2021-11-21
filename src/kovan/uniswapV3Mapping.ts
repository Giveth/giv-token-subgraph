import { Transfer } from '../../generated/uniswapV3/uniswapV3';
import { Price } from '../../generated/schema';
import { uniswapV3Pool } from '../../generated/uniswapV3Pool/uniswapV3Pool';
import { Address } from '@graphprotocol/graph-ts/index';
import { log } from '@graphprotocol/graph-ts';

const uniswapEthGivPoolAddress = Address.fromString('0xa48C26fF05F47a2eEd88C09664de1cb604A21b01');

export function handleTransfer(event: Transfer): void {
  log.error('handleTransfer() has been called', []);
  const contract = uniswapV3Pool.bind(uniswapEthGivPoolAddress);
  const tokensResult = contract.try_getReserves();
  if (tokensResult.reverted) {
    return;
  }
  const source = 'uniswapV3Pool';
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
