"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vault = exports.amountInversions = exports.decimalTracker = exports.tokensQuery = exports.ADDRESSES = exports.VAULTS = void 0;
const data_1 = require("./data");
const queryGraph_1 = require("./queryGraph");
const VAULTS = new Map();
exports.VAULTS = VAULTS;
VAULTS.set("ichi", "https://api.thegraph.com/subgraphs/name/ichi-org/ichi-vault");
VAULTS.set("fuse", "https://api.thegraph.com/subgraphs/name/ichi-org/fuse-vault");
VAULTS.set("wing", "https://api.thegraph.com/subgraphs/name/ichi-org/wing-vault");
VAULTS.set("fox", "https://api.thegraph.com/subgraphs/name/ichi-org/fox-vault");
const ADDRESSES = new Map([
    ["ichi", "0xfaeCcee632912c42a7c88c3544885A8D455408FA"],
    ["fuse", "0x3A4411a33CfeF8BC01f23ED7518208aA38cca824"],
    ["wing", "0x2a8E09552782563f7A076ccec0Ff39473B91Cd8F"],
    ["fox", "0x779F9BAd1f4B1Ef5198AD9361DBf3791F9e0D596"]
]);
exports.ADDRESSES = ADDRESSES;
const tokensQuery = `
  query {
    deposits (orderBy: createdAtTimestamp, orderDirection: desc) {
      id
      amount0
      amount1
      createdAtTimestamp
      sqrtPrice
      totalAmount0
      totalAmount1
    }
    withdraws (orderBy: createdAtTimestamp, orderDirection: desc) {
      id
      amount0
      amount1
      createdAtTimestamp
      sqrtPrice
      totalAmount0
      totalAmount1
    }
  }
  `;
exports.tokensQuery = tokensQuery;
class Vault {
    vaultName;
    vaultAddress;
    amountsInverted;
    decimals;
    isDepositToggle;
    verboseTransactions;
    distilledTransactions;
    currentVaultValue;
    //XIRR: number
    APR;
    constructor(vaultName) {
        this.vaultName = vaultName;
        this.vaultAddress = VAULTS.get[vaultName];
        this.amountsInverted = amountInversions[vaultName];
        this.decimals = decimalTracker[vaultName];
        this.isDepositToggle = true;
        (0, data_1.parseData)(this.vaultName, (0, queryGraph_1.subgraph_query)(this.vaultName, VAULTS.get(this.vaultName)), this);
        //getXIRR(this);
        (0, data_1.getAPR)(this);
    }
}
exports.Vault = Vault;
// @TODO FIX!!!!!!!!
let decimalTracker = {
    "ichi": { oneToken: 18, scarceToken: 9 },
    "fuse": { oneToken: 18, scarceToken: 18 },
    "wing": { oneToken: 18, scarceToken: 9 },
    "fox": { oneToken: 18, scarceToken: 18 }
};
exports.decimalTracker = decimalTracker;
let amountInversions = {
    "ichi": false,
    "fuse": true,
    'wing': false,
    'fox': false
};
exports.amountInversions = amountInversions;
