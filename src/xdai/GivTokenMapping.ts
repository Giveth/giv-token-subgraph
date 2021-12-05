import { Approval, AuthorizationUsed, ChangeMinter, Transfer } from '../../generated/GIV/GIV';
import { onTransfer } from '../commons/balanceHandler';

export function handleApproval(event: Approval): void {}

export function handleAuthorizationUsed(event: AuthorizationUsed): void {}

export function handleChangeMinter(event: ChangeMinter): void {}

export function handleTransfer(event: Transfer): void {
  onTransfer(event.params.from.toHex(), event.params.to.toHex(), event.params.value);
}
