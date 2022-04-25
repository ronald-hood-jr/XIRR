const VAULTS = new Map()
//VAULTS.set("ichi","https://api.thegraph.com/subgraphs/name/ichi-org/ichi-vault")
//VAULTS.set("fuse","https://api.thegraph.com/subgraphs/name/ichi-org/fuse-vault")
//VAULTS.set("wing","https://api.thegraph.com/subgraphs/name/ichi-org/wing-vault")
//VAULTS.set("fox", "https://api.thegraph.com/subgraphs/name/ichi-org/fox-vault")
VAULTS.set("oja", "https://api.thegraph.com/subgraphs/name/ichi-org/oja-vault")
//VAULTS.set("gno", "https://api.thegraph.com/subgraphs/name/ichi-org/gno-vault")
VAULTS.set("onebtc","https://api.thegraph.com/subgraphs/name/ichi-org/onebtc-vault")

const ADDRESSES = new Map()
ADDRESSES.set("ichi", "0xfaeCcee632912c42a7c88c3544885A8D455408FA")
ADDRESSES.set("fuse", "0x3A4411a33CfeF8BC01f23ED7518208aA38cca824")
ADDRESSES.set("wing", "0x2a8E09552782563f7A076ccec0Ff39473B91Cd8F")
ADDRESSES.set("fox", "0x779F9BAd1f4B1Ef5198AD9361DBf3791F9e0D596")
ADDRESSES.set("oja", "0x98bAd5Ce592DcfE706CC95a1B9dB7008B6D418F8")
ADDRESSES.set("gno", "0xA380EA6BE1C084851aE7846a8F39def17eCf6ED8")
ADDRESSES.set("onebtc","0x5318c21c96256ce4b73c27d405147df97d28e0be")
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
  `

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
  `

let decimalTracker={
  "ichi": {oneToken:18, scarceToken:9},
  "fuse": {oneToken:18, scarceToken:18},
  "wing": {oneToken:18, scarceToken:9},
  "fox": { oneToken: 18, scarceToken: 18 },
  "oja": { oneToken: 18, scarceToken: 18 },
  "gno": { oneToken: 18, scarceToken: 9 },
  "onebtc": {oneToken:18, scarceToken:9}
}


let amountInversions = {
  "ichi": false,
  "fuse": true,
  'wing': false,
  'fox': false,
  "oja": true,
  "gno": false,
  "oneBTC": true
}
  
export {VAULTS, ADDRESSES, depositTokensQuery, withdrawalTokensQuery, decimalTracker, amountInversions}