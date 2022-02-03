import * as ethers from 'ethers'
import { getPrice } from './utils';

//INFURA_KEY - 260f81fe952b4020b805e772f0488f81
//https://mainnet.infura.io/v3/260f81fe952b4020b805e772f0488f81

async function getCurrentVaultValue(vaultName:string, vaultAddress: string, amountsInverted: boolean, oneTokenDecimals:number, scarceTokenDecimals:number): Promise<number>{
    
    //get Current Balance
    const provider = new ethers.providers.InfuraProvider('homestead', '260f81fe952b4020b805e772f0488f81');

    const vaultAbi = './abis/vaultABI.json'
    const vaultContract = new ethers.Contract(vaultAddress, vaultAbi, provider)
    const totalAmountArray = await vaultContract.getTotalAmounts()

    const unformattedTotalOneTokenAmount = amountsInverted ? totalAmountArray[1] : totalAmountArray[0]
    const unformattedTotalScarceTokenAmount = amountsInverted? totalAmountArray[0] : totalAmountArray[1]
    const totalOneTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalOneTokenAmount,oneTokenDecimals)) 
    const totalScarceTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalScarceTokenAmount, scarceTokenDecimals))

    //get Current Price
    const poolAddress: string = await vaultContract.pool()
    const poolAbi = './abis/poolABI.json'
    const poolContract = new ethers.Contract(poolAddress, poolAbi, provider)
    const sqrtPrice = await poolContract.slot0()[0]
    const price = getPrice(vaultName, amountsInverted, sqrtPrice)
    
    let currentVaultValue = totalOneTokenAmount + price * totalScarceTokenAmount
    return currentVaultValue
}

export { getCurrentVaultValue }