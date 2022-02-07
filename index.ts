import { VAULTS, depositTokensQuery, withdrawalTokensQuery } from "./config";
import { subgraph_query } from "./queryGraph";
import { distilledTransactionObject, Vault, verboseTransactionObject } from "./vault";
import * as pkg from '@apollo/client';
import * as fs from 'fs'

(async () => {
    var vaultHolder: Vault[] = [];
    for (const [vaultName, vaultEndpoint] of VAULTS){
        let dataPackets: dataPacket[] = []

        let endOfDepositData = false
        let endOfWithdrawalData = false

        let depositPage = 1;
        let withdrawalPage = 1;
        while (!endOfDepositData) {
            let rawData = await subgraph_query(vaultEndpoint, depositPage, depositTokensQuery)
            if (rawData.data['deposits'].length < 1) {
                endOfDepositData = true;
            } else {
                dataPackets.push({ data: rawData, type: 'deposit' })
                depositPage++
            }
        }

        while (!endOfWithdrawalData) {
            let rawData = await subgraph_query(vaultEndpoint, withdrawalPage, withdrawalTokensQuery)
            if (rawData['data']['withdraws'].length < 1) {
                endOfWithdrawalData = true;
            } else {
                dataPackets.push({ data: rawData, type: 'withdrawal' })
                withdrawalPage++
            }
        }
        
        let vault = new Vault(vaultName, vaultEndpoint, dataPackets)
        

        await vault.calcCurrentValue()
        await vault.getAPR()
        writeDataToDisk(vaultName, vault.distilledTransactions, vault.currentVaultValue)
        await vault.getIRR()
        vaultHolder.push(vault)
        
    }
})();

function writeDataToDisk(name: string, data: distilledTransactionObject[],currentVaultValue: number) {
    let googleDateData = []
    let currentTime = new Date(Date.now())
    let currentTimeString = currentTime.getFullYear()+'/'+(1+currentTime.getMonth())+'/'+currentTime.getDate()
    for (let datum of data) {
        googleDateData.push({amount:datum.amount*-1, when:datum.when.getFullYear()+"/"+(datum.when.getMonth()+1)+'/'+datum.when.getDate()})
    }
    googleDateData.push({ amount: currentVaultValue, when: currentTimeString })
    let csvData = []
    for (let obj of googleDateData) {
       csvData.push([obj.amount, obj.when]) 
    }

    let csvContent = "data:text/csv;charset=utf-8\r\namount,when\n";

    csvData.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    fs.writeFileSync('./prints/'+name+'.csv',csvContent);
}

type dataPacket = {
    data: pkg.ApolloQueryResult<any>,
    type: 'deposit' | 'withdrawal'
}

export {dataPacket}
