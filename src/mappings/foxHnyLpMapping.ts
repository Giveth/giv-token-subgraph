import { Transfer } from '../../generated/GIV/GIV';
import { onTransfer } from '../commons/balanceHandler';
import { FOX_HNY_LP } from '../helpers/constants';

export function handleTransfer(event: Transfer): void {
  onTransfer(event.params.from.toHex(), event.params.to.toHex(), event.params.value, FOX_HNY_LP);
}
