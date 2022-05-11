import { onTransfer } from '../commons/balanceHandler';
import { CULT_ETH_LP } from '../helpers/constants';
import { Transfer } from '../../generated/cultEthLP/MinimalERC20';

export function handleTransfer(event: Transfer): void {
  onTransfer(event.params.from.toHex(), event.params.to.toHex(), event.params.value, CULT_ETH_LP);
}
