import * as ethers from 'ethers'
import { getPrice } from './utils';
import vaultABI from './abis/vaultABI.json';
import poolABI from './abis/poolABI.json';

async function getCurrentVaultValue(vaultName:string, vaultAddress: string, amountsInverted: boolean, oneTokenDecimals:number, scarceTokenDecimals:number): Promise<number>{
    
    //get Current Balance
    const RPC_HOST = `https://mainnet.infura.io/v3/260f81fe952b4020b805e772f0488f81`;
    const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
    console.log(vaultAddress)
    const vaultContract = new ethers.Contract(vaultAddress, vaultABI, provider)
    const totalAmountArray = await vaultContract.getTotalAmounts()

    const unformattedTotalOneTokenAmount = amountsInverted ? totalAmountArray[1] : totalAmountArray[0]
    const unformattedTotalScarceTokenAmount = amountsInverted? totalAmountArray[0] : totalAmountArray[1]
    const totalOneTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalOneTokenAmount,oneTokenDecimals)) 
    const totalScarceTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalScarceTokenAmount, scarceTokenDecimals))

    //get Current Price
    const poolAddress: string = await vaultContract.pool()
    const poolContract = new ethers.Contract(poolAddress, poolABI, provider)
    const slot0 = await poolContract.slot0()
    //console.log(slot0)
    const sqrtPrice = slot0[0]
    console.log(sqrtPrice.toString())
    const price = getPrice(vaultName, amountsInverted, sqrtPrice)
    
    let currentVaultValue = totalOneTokenAmount + price * totalScarceTokenAmount
    return currentVaultValue
}

export { getCurrentVaultValue }