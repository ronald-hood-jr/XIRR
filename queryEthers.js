"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentVaultValue = void 0;
const ethers = require("ethers");
const utils_1 = require("./utils");
//INFURA_KEY - 260f81fe952b4020b805e772f0488f81
//https://mainnet.infura.io/v3/260f81fe952b4020b805e772f0488f81
async function getCurrentVaultValue(vaultName, vaultAddress, amountsInverted, oneTokenDecimals, scarceTokenDecimals) {
    //get Current Balance
    const provider = new ethers.providers.InfuraProvider('homestead', '260f81fe952b4020b805e772f0488f81');
    const vaultAbi = './abis/vaultABI.json';
    const vaultContract = new ethers.Contract(vaultAddress, vaultAbi, provider);
    const totalAmountArray = await vaultContract.getTotalAmounts();
    const unformattedTotalOneTokenAmount = amountsInverted ? totalAmountArray[1] : totalAmountArray[0];
    const unformattedTotalScarceTokenAmount = amountsInverted ? totalAmountArray[0] : totalAmountArray[1];
    const totalOneTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalOneTokenAmount, oneTokenDecimals));
    const totalScarceTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalScarceTokenAmount, scarceTokenDecimals));
    //get Current Price
    const poolAddress = await vaultContract.pool();
    const poolAbi = './abis/poolABI.json';
    const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);
    const sqrtPrice = await poolContract.slot0()[0];
    const price = (0, utils_1.getPrice)(vaultName, amountsInverted, sqrtPrice);
    let currentVaultValue = totalOneTokenAmount + price * totalScarceTokenAmount;
    return currentVaultValue;
}
exports.getCurrentVaultValue = getCurrentVaultValue;
