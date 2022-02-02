import * as pkg from '@apollo/client';
import * as univ3prices from '@thanpolas/univ3prices'
import * as xirr from 'xirr'
import { decimalTracker, amountInversions, distilledTransactionObject, Vault, verboseTransactionObject} from './config'

function parseData(name: string, data: pkg.ApolloQueryResult<any>, vault: Vault) {
    
    //const deposit_transactions = new Map();
    //const withdrawal_transactions = new Map();
    //let distilledTransactions: distilledTransactionObject[]
    //let vault = new Vault(name)

    for (let transactionType of [data.data.deposits, data.data.withdraws]) {

        for (const transaction of transactionType) {

            const date = new Date(transaction.createdAtTimestamp * 1000)
            const oneTokenAmount = (vault.amountsInverted ? parseInt(transaction["amount1"]) : parseInt(transaction["amount0"]))
            const scarceTokenAmount = (vault.amountsInverted ? parseInt(transaction["amount1"]) : parseInt(transaction["amount0"] ))
            const price = vault.isDepositToggle ? -1*parseFloat(getPrice(name, vault.amountsInverted, parseInt(transaction["sqrtPrice"]))) :
                parseFloat(getPrice(name, vault.amountsInverted,parseInt(transaction["sqrtPrice"])))
            const oneTokenTotalAmount = (vault.amountsInverted ? parseInt(transaction["totalAmount1"]) : parseInt(transaction["totalAmount0"]))
            const scarceTokenTotalAmount = (vault.amountsInverted ? parseInt(transaction["totalAmount1"]) : parseInt(transaction["totalAmount0"]))
            const type = vault.isDepositToggle ? 'deposit' : 'withdrawal'

            let holder: verboseTransactionObject = {
                'date': date,
                "oneTokenAmount": oneTokenAmount,
                "scarceTokenAmount": scarceTokenAmount,
                "price": price,
                "oneTokenTotalAmount": oneTokenTotalAmount,
                "scarceTokenTotalAmount": scarceTokenTotalAmount,
                'type':type
            }

            vault.verboseTransactions.push(holder)
        }
        vault.isDepositToggle = false
    }

    console.log('verbose data',vault.verboseTransactions)
    vault.verboseTransactions.sort(compare)

    for (const transaction of vault.verboseTransactions) {
        console.log(`distilled transaction`, transaction)
        const dollarAmount = getDollarAmount(transaction);
        const holder:distilledTransactionObject = {'amount':dollarAmount, 'when':transaction.date}
        vault.distilledTransactions.push(holder)
    }

}

function getPrice(name: string, isInverted: boolean, sqrtPrice: number){
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

//returns IRR
/*function getXIRR(vault: Vault){
    const rate = xirr(vault.distilledTransactions,{guess:-0.1});
    console.log(`The IRR of the ${vault.vaultName} vault is `, rate)
}*/

function getAPR(vault: Vault){
    let deposits = 0;
    let withdrawals = 0
    const transactions = vault.distilledTransactions
    const currentVaultValue = vault.currentVaultValue;
    const numTransactions = transactions.length
    const millisecondsToYears = 1000 * 60 * 60 * 24 * 365;
    const vaultTimeYears = (transactions[numTransactions-1].when.getTime()-transactions[0].when.getTime())/millisecondsToYears



    for (let transaction of transactions) {
        let amount = transaction.amount
        amount < 0? deposits+=amount : withdrawals+=amount
    }
    
    const APR =((withdrawals + currentVaultValue)/deposits*100-100)/vaultTimeYears
    console.log(`The APR of the ${name} vault is: ${APR}`)
}

export {parseData, getAPR, /*getXIRR,*/getPrice}