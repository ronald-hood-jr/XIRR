import * as pkg from '@apollo/client';
import * as fs from 'fs';
const univ3prices = require('@thanpolas/univ3prices');
var xirr = require('xirr');

function parseData(name: string, data: pkg.ApolloQueryResult<any>){
    const deposit_transactions = new Map();
    const withdrawal_transactions = new Map();
    for(let deposit of data.data.deposits){

        let date = new Date(deposit.createdAtTimestamp*1000)
        let price = parseFloat(getPrice(name, parseInt(deposit["sqrtPrice"])))

        let holder = new Map();
        holder.set("amount0", parseInt(deposit["amount0"]));
        holder.set("amount1", parseInt(deposit["amount1"]));
        holder.set("price", price);
        holder.set("totalAmount0", parseInt(deposit["totalAmount0"]));
        holder.set("totalAmount1", parseInt(deposit["totalAmount1"]))
        
        deposit_transactions.set(new Date(date.getUTCFullYear(), 
        date.getUTCMonth(), date.getUTCDate()), holder)
}
  
    for(let withdrawal of data.data.withdraws){

        let date = new Date(withdrawal.createdAtTimestamp*1000)
        let price = parseFloat(getPrice(name,parseInt(withdrawal["sqrtPrice"])))

        let holder = new Map();
        holder.set("amount0", parseInt(withdrawal["amount0"]))
        holder.set("amount1", parseInt(withdrawal["amount1"]))
        holder.set("price", price)
        holder.set("totalAmount0", parseInt(withdrawal["totalAmount0"]))
        holder.set("totalAmount1", parseInt(withdrawal["totalAmount1"]))
        
        

        withdrawal_transactions.set(new Date(date.getUTCFullYear(), 
        date.getUTCMonth(), date.getUTCDate()), holder)
    }

    writeData(name, deposit_transactions, withdrawal_transactions)
}

function getPrice(name: string, sqrtPrice: number){
    var price;
    switch(name){
      case "ichi":
        price = univ3prices([18, 9], sqrtPrice).toSignificant({
          reverse: false,
          decimalPlaces: 3,
      });
        break;
      case "fuse":
        price = univ3prices([18, 18], sqrtPrice).toSignificant({
          reverse: true,
          decimalPlaces: 3,
      });
        break;
      case "wing":
        price = univ3prices([18, 9], sqrtPrice).toSignificant({
          reverse: false,
          decimalPlaces: 3,
      });
        break;
      case "fox":
        price = univ3prices([18, 18], sqrtPrice).toSignificant({
          reverse: false,
          decimalPlaces: 3,
      });
        break;
    }
    return price;
  }
  
function writeData(name: string, deposit_transactions: Map<any, any>, 
    withdrawal_transactions: Map<any, any>){

    switch (name){
        case "ichi": {

            let ichiTransactions: any[] = []
            let oneTokenDecimals = 18
            let scarceTokenDecimals = 9

            for(const [key, value] of deposit_transactions){
                setTransactions(name,value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals,
                scarceTokenDecimals, value.get('price'), key, ichiTransactions, false)
            }
            for(const [key, value] of withdrawal_transactions){
                setTransactions(name,value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals,
                scarceTokenDecimals, value.get('price'), key, ichiTransactions, true)
            }
            ichiTransactions = ichiTransactions.sort(compare)
            if(deposit_transactions.has(ichiTransactions[ichiTransactions.length-1]['when'])){
                let holder = deposit_transactions.get(ichiTransactions[ichiTransactions.length-1]['when'])
                ichiTransactions.push({amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, 
                    scarceTokenDecimals, holder.get('price'), true),
                    when:ichiTransactions[ichiTransactions.length-1]['when']})
            } else {
                let holder = withdrawal_transactions.get(ichiTransactions[ichiTransactions.length-1]['when'])
                ichiTransactions.push({amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, 
                    scarceTokenDecimals, holder.get('price'), true),
                    when:ichiTransactions[ichiTransactions.length-1]['when']})
            }
            //console.log(ichiTransactions);
            //getXIRR(name, ichiTransactions)
            break;

        }
        case "fuse": {

            let fuseTransactions: any[] = []
            let oneTokenDecimals = 18
            let scarceTokenDecimals = 18

            for(const [key, value] of deposit_transactions){
                setTransactions(name,value.get('amount1'), value.get('amount0'), value.get('totalAmount1'), value.get('totalAmount0'), oneTokenDecimals,
                scarceTokenDecimals, value.get('price'), key, fuseTransactions, false)
            }
            for(const [key, value] of withdrawal_transactions){
                setTransactions(name,value.get('amount1'), value.get('amount0'), value.get('totalAmount1'), value.get('totalAmount0'), oneTokenDecimals,
                scarceTokenDecimals, value.get('price'), key, fuseTransactions, true)
            }
            fuseTransactions = fuseTransactions.sort(compare)
            if(deposit_transactions.has(fuseTransactions[fuseTransactions.length-1]['when'])){
                let holder = deposit_transactions.get(fuseTransactions[fuseTransactions.length-1]['when'])
                fuseTransactions.push({amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, 
                    scarceTokenDecimals, holder.get('price'), true),
                    when:fuseTransactions[fuseTransactions.length-1]['when']})
            } else {
                let holder = withdrawal_transactions.get(fuseTransactions[fuseTransactions.length-1]['when'])
                fuseTransactions.push({amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, 
                    scarceTokenDecimals, holder.get('price'), true),
                    when:fuseTransactions[fuseTransactions.length-1]['when']})
            }
            //console.log(fuseTransactions);
            //getXIRR(name, fuseTransactions)
            break;
        }
        case "wing": {
            let wingTransactions: any[] = []
            let oneTokenDecimals = 18
            let scarceTokenDecimals = 9
            
            for(const [key, value] of deposit_transactions){
                setTransactions(name,value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals,
                scarceTokenDecimals, value.get('price'), key, wingTransactions, false)
            }
            for(const [key, value] of withdrawal_transactions){
                setTransactions(name,value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals,
                scarceTokenDecimals, value.get('price'), key, wingTransactions, true)
            }

            wingTransactions = wingTransactions.sort(compare)
            if(deposit_transactions.has(wingTransactions[wingTransactions.length-1]['when'])){
                let holder = deposit_transactions.get(wingTransactions[wingTransactions.length-1]['when'])
                wingTransactions.push({amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, 
                    scarceTokenDecimals, holder.get('price'), true),
                    when:wingTransactions[wingTransactions.length-1]['when']})
            } else {
                let holder = withdrawal_transactions.get(wingTransactions[wingTransactions.length-1]['when'])
                wingTransactions.push({amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, 
                    scarceTokenDecimals, holder.get('price'), true),
                    when:wingTransactions[wingTransactions.length-1]['when']})
            }
            //console.log(wingTransactions);
            //getXIRR(name, wingTransactions)
            break;
        }
        case "fox": {
            let foxTransactions: any[] = []
            let oneTokenDecimals = 18
            let scarceTokenDecimals = 18
            
            for(const [key, value] of deposit_transactions){
                setTransactions(name,value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals,
                scarceTokenDecimals, value.get('price'), key, foxTransactions, false)
            }
            for(const [key, value] of withdrawal_transactions){
                setTransactions(name,value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals,
                scarceTokenDecimals, value.get('price'), key, foxTransactions, true)
            }
            foxTransactions = foxTransactions.sort(compare)
            if(deposit_transactions.has(foxTransactions[foxTransactions.length-1]['when'])){
                let holder = deposit_transactions.get(foxTransactions[foxTransactions.length-1]['when'])
                foxTransactions.push({amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, 
                    scarceTokenDecimals, holder.get('price'), true),
                    when:foxTransactions[foxTransactions.length-1]['when']})
            } else {
                let holder = withdrawal_transactions.get(foxTransactions[foxTransactions.length-1]['when'])
                foxTransactions.push({amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, 
                    scarceTokenDecimals, holder.get('price'), true),
                    when:foxTransactions[foxTransactions.length-1]['when']})
            }
            //console.log(foxTransactions);
            getXIRR(name, foxTransactions)
            break;
        }
    }
  

}

function compare(a,b){
    if(a['when'] > b['when']){
        return 1;
    } else if (b['when'] > a['when']){
        return -1;
    } else {
        return 0;
    }
}

function getUSD(name: string, oneTokenAmount: number, scarceTokenAmount: number, oneTokenDecimals: number, 
    scarceTokenDecimals: number, price: number, isWithdrawal: boolean): number{
        let amount = oneTokenAmount/10**oneTokenDecimals+scarceTokenAmount/10**scarceTokenDecimals*price
        if(isWithdrawal){
            return amount;
        } else {
            return -1*amount
        }
}

function setTransactions(name: string, oneTokenAmount: number, scarceTokenAmount: number, 
    oneTokenTotalAmount: number, scarceTokenTotalAmount: number, oneTokenDecimals: number, 
    scarceTokenDecimals: number, price: number, date: Date, transactions:any[], isWithdraw: boolean){
    
    transactions.push({amount:getUSD(name, oneTokenAmount, scarceTokenAmount, oneTokenDecimals,
        scarceTokenDecimals, price, isWithdraw),when: date})
}

  //returns IRR
function getXIRR(name: string, transactions: any[]){
    var rate = xirr(transactions);
    console.log(`The IRR of the ${name} vault is `, rate)
}

export {parseData}