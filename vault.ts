import { decimalTracker, VAULTS, amountInversions } from './config'
import * as pkg from '@apollo/client';
import 'cross-fetch/dist/node-polyfill.js';
import { subgraph_query } from './queryGraph';
import { getCurrentVaultValue } from './queryEthers';
import { getDistilledTransactions, getVerboseTransactions } from './data';

class Vault {

    vaultName: string
    vaultEndpoint: string
    vaultAddress: string
    amountsInverted: boolean
    decimals: decimalsObject
    isDepositToggle: boolean
    rawData: pkg.ApolloQueryResult<any>
    verboseTransactions: verboseTransactionObject[] = []
    distilledTransactions: distilledTransactionObject[] = []
    currentVaultValue: number
    APR: number

    constructor(vaultName: string, vaultEndpoint: string) {
        this.vaultName = vaultName
        this.vaultEndpoint = vaultEndpoint
        this.vaultAddress = VAULTS.get[vaultName]
        this.amountsInverted = amountInversions[vaultName]
        this.decimals = decimalTracker[vaultName]
        this.isDepositToggle = true
        this.rawData = subgraph_query(this.vaultEndpoint)
        this.verboseTransactions = getVerboseTransactions(this.vaultName, this.rawData, this.amountsInverted)
        this.distilledTransactions = getDistilledTransactions(this.verboseTransactions)
        getCurrentVaultValue(this.vaultName, this.vaultAddress, this.amountsInverted, this.decimals.oneToken, this.decimals.scarceToken)
            .then((value: number) => {
                this.currentVaultValue = value
            })
            .catch((error) => {
                console.log(error)
            })
    }
    
    getAPR() {
        let deposits = 0;
        let withdrawals = 0
        const transactions = this.distilledTransactions
        const currentVaultValue = this.currentVaultValue;
        const numTransactions = transactions.length
        const millisecondsToYears = 1000 * 60 * 60 * 24 * 365;
        const vaultTimeYears = (transactions[numTransactions - 1].when.getTime() - transactions[0].when.getTime()) / millisecondsToYears

        for (let transaction of transactions) {
            let amount = transaction.amount
            amount < 0 ? deposits += amount : withdrawals += amount
        }
    
        this.APR = ((withdrawals + currentVaultValue) / deposits * 100 - 100) / vaultTimeYears
        console.log(`The APR of the ${name} vault is: ${this.APR}`)
    }

}


type verboseTransactionObject = {
  'date': Date,
  'oneTokenAmount': number,
  'scarceTokenAmount': number,
  'price': number,
  'oneTokenTotalAmount': number,
  'scarceTokenTotalAmount': number,
  'type': 'deposit' | 'withdrawal'
}

type distilledTransactionObject = {
  amount: number,
  when: Date
}

type decimalsObject = {
  oneToken: number,
  scarceToken: number
}

export {distilledTransactionObject, Vault, verboseTransactionObject}