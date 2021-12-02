import { Transfer } from '../../generated/GIV/GIV';
import { updateBalance } from '../commons/balanceHandler';
import { BALANCER_LP } from '../helpers/constants';

export function handleTransfer(event: Transfer): void {
  updateBalance(event.params.from.toHex(), event.params.to.toHex(), event.params.value, BALANCER_LP);
}
