import { Transfer } from '../../generated/GIV/GIV';
import { onTransfer } from '../commons/balanceHandler';
import { HONEYSWAP_LP } from '../helpers/constants';

export function handleTransfer(event: Transfer): void {
  onTransfer(event.params.from.toHex(), event.params.to.toHex(), event.params.value, HONEYSWAP_LP);
}
