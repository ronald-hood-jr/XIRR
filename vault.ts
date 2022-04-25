import { decimalTracker, amountInversions, ADDRESSES } from './config'
import * as pkg from '@apollo/client';
import 'cross-fetch/dist/node-polyfill.js';
import { getCurrentVaultValue } from './queryEthers';
import { getDistilledTransactions, getVerboseTransactions } from './data';
import { dataPacket } from 'index';
import xirr from 'xirr'
class Vault {

    vaultName: string
    vaultEndpoint: string
    vaultAddress: string
    amountsInverted: boolean
    decimals: decimalsObject
    isDepositToggle: boolean
    dataPackets: dataPacket[]
    verboseTransactions: verboseTransactionObject[] = []
    distilledTransactions: distilledTransactionObject[] = []
    currentVaultValue: number
    APR: number

    constructor(vaultName: string, vaultEndpoint: string, data: dataPacket[]) {
        this.vaultName = vaultName
        this.vaultEndpoint = vaultEndpoint
        this.vaultAddress = ADDRESSES.get(vaultName)
        this.amountsInverted = amountInversions[vaultName]
        this.decimals = decimalTracker[vaultName]
        this.isDepositToggle = true
        this.dataPackets = data
        this.verboseTransactions = getVerboseTransactions(this.vaultName, 
        this.dataPackets, this.amountsInverted, this.decimals.scarceToken)
        this.distilledTransactions = getDistilledTransactions(this.verboseTransactions)
    }

    public async calcCurrentValue() {
      let value = await getCurrentVaultValue(
        this.vaultName, 
        this.vaultAddress, 
        this.amountsInverted, 
        this.decimals.oneToken, 
        this.decimals.scarceToken);

      console.log(value)  
      this.currentVaultValue = value;
    }
    
    public async getAPR() {
        let deposits = 0;
        let withdrawals = 0
        const transactions = this.distilledTransactions
        const currentVaultValue = this.currentVaultValue;
        const numTransactions = transactions.length
        const millisecondsToYears = 1000 * 60 * 60 * 24 * 365;
        const vaultTimeYears = (transactions[numTransactions - 1].when.getTime() - transactions[0].when.getTime()) / millisecondsToYears

        for (let transaction of transactions) {
            //console.log(transaction)
            let amount = transaction.amount
            amount < 0 ? deposits += amount : withdrawals += amount
        }

        //console.log(deposits)
        //console.log(withdrawals)
        //console.log(currentVaultValue)
    
        this.APR = ((withdrawals + currentVaultValue) / (-deposits) * 100 - 100) / vaultTimeYears
        console.log(`The APR of the ${this.vaultName} vault is: ${this.APR}`)
    }
  
  public async getIRR() {
    let xirrObjArray = this.distilledTransactions
    xirrObjArray.push({amount:this.currentVaultValue, when: new Date(Date.now())})
    let irr = xirr(xirrObjArray,{ guess: -0.999999975 })
    console.log(`The IRR of the ${this.vaultName} vault is: `,irr)
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