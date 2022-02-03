import * as pkg from '@apollo/client';
import { BigNumber } from 'ethers';
import { compare, getPrice, getDollarAmount, BNtoNumberWithoutDecimals } from './utils';
import { distilledTransactionObject, verboseTransactionObject } from './vault'


function getVerboseTransactions(
    name: string, 
    data: pkg.ApolloQueryResult<any>, 
    amountsInverted: boolean,
    decimals: number): verboseTransactionObject[] {

    let isDeposit = true;
    let verboseTransactions: verboseTransactionObject[] = []
    for (let transactionType of [data.data.deposits, data.data.withdraws]) {
        for (const transaction of transactionType) {

            const date = new Date(transaction.createdAtTimestamp * 1000)
            const oneTokenAmount = 
                (amountsInverted ? BNtoNumberWithoutDecimals(transaction["amount1"], 18) : BNtoNumberWithoutDecimals(transaction["amount0"], 18))
            const scarceTokenAmount = 
                (amountsInverted ? BNtoNumberWithoutDecimals(transaction["amount0"], decimals) : BNtoNumberWithoutDecimals(transaction["amount1"], decimals))
            
            const price = isDeposit ? -1*parseFloat(getPrice(name, amountsInverted, BigNumber.from(transaction["sqrtPrice"]))) :
                parseFloat(getPrice(name, amountsInverted, BigNumber.from(transaction["sqrtPrice"])))
            
            const oneTokenTotalAmount = 
                (amountsInverted ? BNtoNumberWithoutDecimals(transaction["totalAmount1"], 18) : BNtoNumberWithoutDecimals(transaction["totalAmount0"], 18))
            const scarceTokenTotalAmount = 
                (amountsInverted ? BNtoNumberWithoutDecimals(transaction["totalAmount0"], decimals) : BNtoNumberWithoutDecimals(transaction["totalAmount1"], decimals))
            const type = isDeposit ? 'deposit' : 'withdrawal'

            let holder: verboseTransactionObject = {
                'date': date,
                "oneTokenAmount": oneTokenAmount,
                "scarceTokenAmount": scarceTokenAmount,
                "price": price,
                "oneTokenTotalAmount": oneTokenTotalAmount,
                "scarceTokenTotalAmount": scarceTokenTotalAmount,
                'type':type
            }

            verboseTransactions.push(holder)
        }
        isDeposit = false
    }

    verboseTransactions.sort(compare)
    return verboseTransactions
}

function getDistilledTransactions(verboseTransactions: verboseTransactionObject[]): distilledTransactionObject[] {
    let distilledTransactions: distilledTransactionObject[] = []
    for (const transaction of verboseTransactions) {
        let dollarAmount = getDollarAmount(transaction);
        if (transaction.type == 'deposit') {
            dollarAmount = -dollarAmount;
        }
        const holder:distilledTransactionObject = {'amount':dollarAmount, 'when':transaction.date}
        distilledTransactions.push(holder)
    }
    return distilledTransactions
}

export {getVerboseTransactions, getDistilledTransactions}