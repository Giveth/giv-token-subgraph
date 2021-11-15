import {BigInt} from "@graphprotocol/graph-ts";
import {Balance} from "../../generated/schema";

export function updateBalance(from: string, to:string, value: BigInt):void{
    let toBalance = Balance.load(from)
    if (!toBalance){
        toBalance = new Balance(from)
        toBalance.balance = value
    }else{
        toBalance.balance.plus(value)
    }
    toBalance.save()

    const fromBalance = Balance.load(to)
    if (!fromBalance){
        // What should we do in this case? Actually it should not reach to this line
        return
    }
    fromBalance.balance.minus(value)
    fromBalance.save()
}