import { Transfer } from '../../generated/GIV/GIV';
import { updateBalance } from '../commons/balanceHandler';
import { HONEYSWAP_LP } from '../helpers/constants';

export function handleTransfer(event: Transfer): void {
  updateBalance(event.params.from.toHex(), event.params.to.toHex(), event.params.value, HONEYSWAP_LP);
}
