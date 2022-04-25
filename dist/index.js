"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const queryGraph_1 = require("./queryGraph");
const vault_1 = require("./vault");
const fs = __importStar(require("fs"));
(async () => {
    var vaultHolder = [];
    for (const [vaultName, vaultEndpoint] of config_1.VAULTS) {
        let dataPackets = [];
        let endOfDepositData = false;
        let endOfWithdrawalData = false;
        let depositPage = 1;
        let withdrawalPage = 1;
        while (!endOfDepositData) {
            let rawData = await (0, queryGraph_1.subgraph_query)(vaultEndpoint, depositPage, config_1.depositTokensQuery);
            if (rawData.data['deposits'].length < 1) {
                endOfDepositData = true;
            }
            else {
                dataPackets.push({ data: rawData, type: 'deposit' });
                depositPage++;
            }
        }
        while (!endOfWithdrawalData) {
            let rawData = await (0, queryGraph_1.subgraph_query)(vaultEndpoint, withdrawalPage, config_1.withdrawalTokensQuery);
            if (rawData['data']['withdraws'].length < 1) {
                endOfWithdrawalData = true;
            }
            else {
                dataPackets.push({ data: rawData, type: 'withdrawal' });
                withdrawalPage++;
            }
        }
        let vault = new vault_1.Vault(vaultName, vaultEndpoint, dataPackets);
        await vault.calcCurrentValue();
        await vault.getAPR();
        writeDataToDisk(vaultName, vault.distilledTransactions, vault.currentVaultValue);
        await vault.getIRR();
        vaultHolder.push(vault);
    }
})();
function writeDataToDisk(name, data, currentVaultValue) {
    let googleDateData = [];
    let currentTime = new Date(Date.now());
    let currentTimeString = currentTime.getFullYear() + '/' + (1 + currentTime.getMonth()) + '/' + currentTime.getDate();
    for (let datum of data) {
        googleDateData.push({ amount: datum.amount * -1, when: datum.when.getFullYear() + "/" + (datum.when.getMonth() + 1) + '/' + datum.when.getDate() });
    }
    googleDateData.push({ amount: currentVaultValue, when: currentTimeString });
    let csvData = [];
    for (let obj of googleDateData) {
        csvData.push([obj.amount, obj.when]);
    }
    let csvContent = "data:text/csv;charset=utf-8\r\namount,when\n";
    csvData.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    fs.writeFileSync('./prints/' + name + '.csv', csvContent);
}
//# sourceMappingURL=index.js.map