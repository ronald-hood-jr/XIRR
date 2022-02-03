const VAULTS = new Map()
VAULTS.set("ichi","https://api.thegraph.com/subgraphs/name/ichi-org/ichi-vault")
VAULTS.set("fuse","https://api.thegraph.com/subgraphs/name/ichi-org/fuse-vault")
VAULTS.set("wing","https://api.thegraph.com/subgraphs/name/ichi-org/wing-vault")
VAULTS.set("fox","https://api.thegraph.com/subgraphs/name/ichi-org/fox-vault")

const ADDRESSES = new Map([
  ["ichi", "0xfaeCcee632912c42a7c88c3544885A8D455408FA"],
  ["fuse", "0x3A4411a33CfeF8BC01f23ED7518208aA38cca824"],
  ["wing", "0x2a8E09552782563f7A076ccec0Ff39473B91Cd8F"],
  ["fox", "0x779F9BAd1f4B1Ef5198AD9361DBf3791F9e0D596"]])

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
  `

let decimalTracker={
  "ichi": {oneToken:18, scarceToken:9},
  "fuse": {oneToken:18, scarceToken:18},
  "wing": {oneToken:18, scarceToken:9},
  "fox": {oneToken:18, scarceToken:18}
}


let amountInversions = {
  "ichi": false,
  "fuse": true,
  'wing': false,
  'fox': false
}
  
export {VAULTS, ADDRESSES, tokensQuery, decimalTracker, amountInversions}