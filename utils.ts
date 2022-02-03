import univ3prices from '@thanpolas/univ3prices';
import { verboseTransactionObject } from './vault';
import { decimalTracker } from './config';
import { BigNumber } from 'ethers';

function getPrice(name: string, isInverted: boolean, sqrtPrice: BigNumber) {
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

function BNtoNumberWithoutDecimals(val: string, decimals: number): number {
    if (val != null) {
        const digits = val.length
        let tempVal = ''
        if (digits <= decimals) {
            tempVal = '0.'
            for (let i = 0; i < decimals - digits; i++) {
                tempVal = `${tempVal}0`
            }
            tempVal = `${tempVal}${val}`
        } else {
            for (let i = 0; i < digits - decimals; i++) {
                tempVal = `${tempVal}${val[i]}`
            }
            tempVal = `${tempVal}.`
            for (let i = digits - decimals; i < digits; i++) {
                tempVal = `${tempVal}${val[i]}`
            }
        }
        return Number(tempVal)
    }
    return 0
}
  
export {compare, getDollarAmount, getPrice, BNtoNumberWithoutDecimals}