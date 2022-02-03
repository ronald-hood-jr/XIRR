import * as univ3prices from '@thanpolas/univ3prices'
import { verboseTransactionObject } from './vault';
import { decimalTracker } from './config';

function getPrice(name: string, isInverted: boolean, sqrtPrice: number) {
    let decimalArray = [decimalTracker[name].oneToken,decimalTracker[name].scarceToken]
    let price = univ3prices(decimalArray, sqrtPrice).toSignificant({
        reverse: isInverted,
        decimalPlaces: 3
    });

    return price;
}
 
function getDollarAmount(transaction: verboseTransactionObject): number {
    const oneTokenAmount = transaction.oneTokenAmount
    const scarceTokenAmount = transaction.scarceTokenAmount
    const price = transaction.price

    return (oneTokenAmount+price*scarceTokenAmount)
}

function compare(a,b){
    if(a['date'] > b['date']){
        return 1;
    } else if (b['date'] > a['date']){
        return -1;
    } else {
        return 0;
    }
}

export {compare, getDollarAmount, getPrice}