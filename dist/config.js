"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountInversions = exports.decimalTracker = exports.withdrawalTokensQuery = exports.depositTokensQuery = exports.ADDRESSES = exports.VAULTS = void 0;
const VAULTS = new Map();
exports.VAULTS = VAULTS;
VAULTS.set("ichi", "https://api.thegraph.com/subgraphs/name/ichi-org/ichi-vault");
VAULTS.set("fuse", "https://api.thegraph.com/subgraphs/name/ichi-org/fuse-vault");
VAULTS.set("wing", "https://api.thegraph.com/subgraphs/name/ichi-org/wing-vault");
VAULTS.set("fox", "https://api.thegraph.com/subgraphs/name/ichi-org/fox-vault");
const ADDRESSES = new Map();
exports.ADDRESSES = ADDRESSES;
ADDRESSES.set("ichi", "0xfaeCcee632912c42a7c88c3544885A8D455408FA");
ADDRESSES.set("fuse", "0x3A4411a33CfeF8BC01f23ED7518208aA38cca824");
ADDRESSES.set("wing", "0x2a8E09552782563f7A076ccec0Ff39473B91Cd8F");
ADDRESSES.set("fox", "0x779F9BAd1f4B1Ef5198AD9361DBf3791F9e0D596");
//query($first: Int, $orderBy: BigInt, $orderDirection: String)
const depositTokensQuery = `
  query($first: Int, $skip:Int) {
    deposits (first: $first, skip: $skip, orderBy: createdAtTimestamp, orderDirection: desc) {
      id
      sender
      amount0
      amount1
      createdAtTimestamp
      sqrtPrice
      totalAmount0
      totalAmount1
    }
  }
  `;
exports.depositTokensQuery = depositTokensQuery;
const withdrawalTokensQuery = `
  query($first: Int, $skip:Int) {
    withdraws (first: $first, skip: $skip, orderBy: createdAtTimestamp, orderDirection: desc) {
      id
      sender
      amount0
      amount1
      createdAtTimestamp
      sqrtPrice
      totalAmount0
      totalAmount1
    }
  }
  `;
exports.withdrawalTokensQuery = withdrawalTokensQuery;
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
//# sourceMappingURL=config.js.map