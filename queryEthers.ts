import { decimalTracker, amountInversions, distilledTransactionObject, Vault, verboseTransactionObject} from './config'
import * as ethers from 'ethers'
import {getPrice} from './data'
//INFURA_KEY - 260f81fe952b4020b805e772f0488f81
//https://mainnet.infura.io/v3/260f81fe952b4020b805e772f0488f81
async function getCurrentVaultValue(vault: Vault) {
    
    //get Current Balance
    const provider = new ethers.providers.InfuraProvider('homestead', '260f81fe952b4020b805e772f0488f81');
    const vaultAddress = vault.vaultAddress;
    const vaultAbi = './abis/vaultABI.json'
    const vaultContract = new ethers.Contract(vaultAddress, vaultAbi, provider)
    const totalAmountArray = await vaultContract.getTotalAmounts()

    const unformattedTotalOneTokenAmount = vault.amountsInverted ? totalAmountArray[1] : totalAmountArray[0]
    const unformattedTotalScarceTokenAmount = vault.amountsInverted? totalAmountArray[0] : totalAmountArray[1]
    const totalOneTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalOneTokenAmount,vault.decimals.oneToken)) 
    const totalScarceTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalScarceTokenAmount, vault.decimals.scarceToken))

    //get Current Price
    const poolAddress: string = await vaultContract.pool()
    const poolAbi = './abis/poolABI.json'
    const poolContract = new ethers.Contract(poolAddress, poolAbi, provider)
    const sqrtPrice = await poolContract.slot0()[0]
    const price = getPrice(vault.vaultName, vault.amountsInverted, sqrtPrice)
    
    vault.currentVaultValue = totalOneTokenAmount + price*totalScarceTokenAmount
}

export { getCurrentVaultValue }