import { onTransfer } from '../commons/balanceHandler';
import { HONEYSWAP_GIV_DAI_LP } from '../helpers/constants';
import { Transfer } from '../../generated/HoneyswapGivDaiLP/MinimalERC20';

export function handleTransfer(event: Transfer): void {
  onTransfer(event.params.from.toHex(), event.params.to.toHex(), event.params.value, HONEYSWAP_GIV_DAI_LP);
}
