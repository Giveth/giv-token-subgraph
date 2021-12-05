import { Approval, AuthorizationUsed, ChangeMinter, Transfer } from '../../generated/GIV/GIV';
import { onTransfer } from '../commons/balanceHandler';
import { Address, log } from '@graphprotocol/graph-ts/index';
import { uniswapV3Pool } from '../../generated/uniswapV3Pool/uniswapV3Pool';
import { Price } from '../../generated/schema';

export function handleApproval(event: Approval): void {}

export function handleAuthorizationUsed(event: AuthorizationUsed): void {}

export function handleChangeMinter(event: ChangeMinter): void {}

export function handleTransfer(event: Transfer): void {
  onTransfer(event.params.from.toHex(), event.params.to.toHex(), event.params.value);
  event.transaction.from.toHex();
  updateTokenPrice();
}

function updateTokenPrice(): void {
  const uniswapEthGivPoolAddress = Address.fromString('0xa48C26fF05F47a2eEd88C09664de1cb604A21b01');
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
