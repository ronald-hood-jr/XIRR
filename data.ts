import * as pkg from '@apollo/client';
import { compare, getPrice, getDollarAmount } from './utils';
import { distilledTransactionObject, Vault, verboseTransactionObject } from './vault'


function getVerboseTransactions(name: string, data: pkg.ApolloQueryResult<any>, amountsInverted: boolean): verboseTransactionObject[] {
    
    let isDeposit = true;
    let verboseTransactions: verboseTransactionObject[] = []
    console.log(data)
    for (let transactionType of [data.data.deposits, data.data.withdraws]) {

        for (const transaction of transactionType) {

            const date = new Date(transaction.createdAtTimestamp * 1000)
            const oneTokenAmount = (amountsInverted ? parseInt(transaction["amount1"]) : parseInt(transaction["amount0"]))
            const scarceTokenAmount = (amountsInverted ? parseInt(transaction["amount1"]) : parseInt(transaction["amount0"] ))
            const price = isDeposit ? -1*parseFloat(getPrice(name, amountsInverted, parseInt(transaction["sqrtPrice"]))) :
                parseFloat(getPrice(name, amountsInverted,parseInt(transaction["sqrtPrice"])))
            const oneTokenTotalAmount = (amountsInverted ? parseInt(transaction["totalAmount1"]) : parseInt(transaction["totalAmount0"]))
            const scarceTokenTotalAmount = (amountsInverted ? parseInt(transaction["totalAmount1"]) : parseInt(transaction["totalAmount0"]))
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
    console.log('verbose data',verboseTransactions)
    

    
    return verboseTransactions
}

function getDistilledTransactions(verboseTransactions: verboseTransactionObject[]): distilledTransactionObject[] {
    let distilledTransactions: distilledTransactionObject[] = []
    for (const transaction of verboseTransactions) {
        console.log(`distilled transaction`, transaction)
        const dollarAmount = getDollarAmount(transaction);
        const holder:distilledTransactionObject = {'amount':dollarAmount, 'when':transaction.date}
        distilledTransactions.push(holder)
    }
    return distilledTransactions
}

export {getVerboseTransactions, getDistilledTransactions}