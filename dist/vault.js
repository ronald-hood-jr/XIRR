"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vault = void 0;
const config_1 = require("./config");
require("cross-fetch/dist/node-polyfill.js");
const queryEthers_1 = require("./queryEthers");
const data_1 = require("./data");
const xirr_1 = __importDefault(require("xirr"));
class Vault {
    constructor(vaultName, vaultEndpoint, data) {
        this.verboseTransactions = [];
        this.distilledTransactions = [];
        this.vaultName = vaultName;
        this.vaultEndpoint = vaultEndpoint;
        this.vaultAddress = config_1.ADDRESSES.get(vaultName);
        this.amountsInverted = config_1.amountInversions[vaultName];
        this.decimals = config_1.decimalTracker[vaultName];
        this.isDepositToggle = true;
        this.dataPackets = data;
        this.verboseTransactions = (0, data_1.getVerboseTransactions)(this.vaultName, this.dataPackets, this.amountsInverted, this.decimals.scarceToken);
        this.distilledTransactions = (0, data_1.getDistilledTransactions)(this.verboseTransactions);
    }
    async calcCurrentValue() {
        let value = await (0, queryEthers_1.getCurrentVaultValue)(this.vaultName, this.vaultAddress, this.amountsInverted, this.decimals.oneToken, this.decimals.scarceToken);
        console.log(value);
        this.currentVaultValue = value;
    }
    async getAPR() {
        let deposits = 0;
        let withdrawals = 0;
        const transactions = this.distilledTransactions;
        const currentVaultValue = this.currentVaultValue;
        const numTransactions = transactions.length;
        const millisecondsToYears = 1000 * 60 * 60 * 24 * 365;
        const vaultTimeYears = (transactions[numTransactions - 1].when.getTime() - transactions[0].when.getTime()) / millisecondsToYears;
        for (let transaction of transactions) {
            //console.log(transaction)
            let amount = transaction.amount;
            amount < 0 ? deposits += amount : withdrawals += amount;
        }
        //console.log(deposits)
        //console.log(withdrawals)
        //console.log(currentVaultValue)
        this.APR = ((withdrawals + currentVaultValue) / (-deposits) * 100 - 100) / vaultTimeYears;
        console.log(`The APR of the ${this.vaultName} vault is: ${this.APR}`);
    }
    async getIRR() {
        let xirrObjArray = this.distilledTransactions;
        xirrObjArray.push({ amount: this.currentVaultValue, when: new Date(Date.now()) });
        let irr = (0, xirr_1.default)(xirrObjArray, { guess: -0.9975 });
        console.log(`The IRR of the ${this.vaultName} vault is: `, irr);
    }
}
exports.Vault = Vault;
//# sourceMappingURL=vault.js.map