import { onTransfer } from '../commons/balanceHandler';
import { UNISWAP_V2_GIV_DAI_LP } from '../helpers/constants';
import { Transfer } from '../../generated/UniswapV2GivDaiLP/MinimalERC20';

export function handleTransfer(event: Transfer): void {
  onTransfer(event.params.from.toHex(), event.params.to.toHex(), event.params.value, UNISWAP_V2_GIV_DAI_LP);
}
