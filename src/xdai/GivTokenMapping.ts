import {Approval, AuthorizationUsed, ChangeMinter, Transfer} from "../../generated/GIV/GIV";
import {updateBalance} from "../commons/balanceHandler";

export function handleApproval(event: Approval): void {}

export function handleAuthorizationUsed(event: AuthorizationUsed): void {}

export function handleChangeMinter(event: ChangeMinter): void {}

export function handleTransfer(event: Transfer): void {
    updateBalance(event.transaction.from.toHex(), event.params.to.toHex(), event.params.value)
}