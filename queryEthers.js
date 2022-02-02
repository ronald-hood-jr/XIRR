"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentVaultValue = void 0;
const ethers = require("ethers");
const data_1 = require("./data");
//INFURA_KEY - 260f81fe952b4020b805e772f0488f81
//https://mainnet.infura.io/v3/260f81fe952b4020b805e772f0488f81
async function getCurrentVaultValue(vault) {
    //get Current Balance
    const provider = new ethers.providers.InfuraProvider('homestead', '260f81fe952b4020b805e772f0488f81');
    const vaultAddress = vault.vaultAddress;
    const vaultAbi = './abis/vaultABI.json';
    const vaultContract = new ethers.Contract(vaultAddress, vaultAbi, provider);
    const totalAmountArray = await vaultContract.getTotalAmounts();
    const totalOneTokenAmount = parseInt(ethers.utils.formatUnits(vault.amountsInverted ? totalAmountArray[1] : totalAmountArray[0], vault.decimals.oneToken));
    const totalScarceTokenAmount = parseInt(ethers.utils.formatUnits(vault.amountsInverted ? totalAmountArray[0] : totalAmountArray[1], vault.decimals.scarceToken));
    //get Current Price
    const poolAddress = await vaultContract.pool();
    const poolAbi = './abis/poolABI.json';
    const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);
    const sqrtPrice = await poolContract.slot0()[0];
    const price = (0, data_1.getPrice)(vault.vaultName, vault.amountsInverted, sqrtPrice);
    vault.currentVaultValue = totalOneTokenAmount + price * totalScarceTokenAmount;
}
exports.getCurrentVaultValue = getCurrentVaultValue;
