const VAULTS = new Map()
VAULTS.set("ichi","https://api.thegraph.com/subgraphs/name/ichi-org/ichi-vault")
VAULTS.set("fuse","https://api.thegraph.com/subgraphs/name/ichi-org/fuse-vault")
VAULTS.set("wing","https://api.thegraph.com/subgraphs/name/ichi-org/wing-vault")
VAULTS.set("fox","https://api.thegraph.com/subgraphs/name/ichi-org/fox-vault")

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
  
export {VAULTS, tokensQuery}