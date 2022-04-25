"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentVaultValue = void 0;
const ethers = __importStar(require("ethers"));
const utils_1 = require("./utils");
const vaultABI_json_1 = __importDefault(require("./abis/vaultABI.json"));
const poolABI_json_1 = __importDefault(require("./abis/poolABI.json"));
async function getCurrentVaultValue(vaultName, vaultAddress, amountsInverted, oneTokenDecimals, scarceTokenDecimals) {
    //get Current Balance
    const RPC_HOST = `https://mainnet.infura.io/v3/260f81fe952b4020b805e772f0488f81`;
    const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
    console.log(vaultAddress);
    const vaultContract = new ethers.Contract(vaultAddress, vaultABI_json_1.default, provider);
    const totalAmountArray = await vaultContract.getTotalAmounts();
    const unformattedTotalOneTokenAmount = amountsInverted ? totalAmountArray[1] : totalAmountArray[0];
    const unformattedTotalScarceTokenAmount = amountsInverted ? totalAmountArray[0] : totalAmountArray[1];
    const totalOneTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalOneTokenAmount, oneTokenDecimals));
    const totalScarceTokenAmount = parseInt(ethers.utils.formatUnits(unformattedTotalScarceTokenAmount, scarceTokenDecimals));
    //get Current Price
    const poolAddress = await vaultContract.pool();
    const poolContract = new ethers.Contract(poolAddress, poolABI_json_1.default, provider);
    const slot0 = await poolContract.slot0();
    //console.log(slot0)
    const sqrtPrice = slot0[0];
    console.log(sqrtPrice.toString());
    const price = (0, utils_1.getPrice)(vaultName, amountsInverted, sqrtPrice);
    let currentVaultValue = totalOneTokenAmount + price * totalScarceTokenAmount;
    return currentVaultValue;
}
exports.getCurrentVaultValue = getCurrentVaultValue;
//# sourceMappingURL=queryEthers.js.map