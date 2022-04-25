"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistilledTransactions = exports.getVerboseTransactions = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
function getVerboseTransactions(name, dataPackets, amountsInverted, decimals) {
    let transactionsType;
    let isDeposit;
    let verboseTransactions = [];
    let packetData;
    const unique_users = new Map();
    for (let packet of dataPackets) {
        if (packet.type == 'deposit') {
            isDeposit = true;
            packetData = packet.data.data['deposits'];
        }
        else {
            isDeposit = false;
            packetData = packet.data.data['withdraws'];
        }
        for (const transaction of packetData) {
            unique_users.set(transaction['sender'], unique_users.size);
            const date = new Date(transaction.createdAtTimestamp * 1000);
            const oneTokenAmount = (amountsInverted ? (0, utils_1.BNtoNumberWithoutDecimals)(transaction["amount1"], 18) : (0, utils_1.BNtoNumberWithoutDecimals)(transaction["amount0"], 18));
            const scarceTokenAmount = (amountsInverted ? (0, utils_1.BNtoNumberWithoutDecimals)(transaction["amount0"], decimals) : (0, utils_1.BNtoNumberWithoutDecimals)(transaction["amount1"], decimals));
            const price = isDeposit ? -1 * parseFloat((0, utils_1.getPrice)(name, amountsInverted, ethers_1.BigNumber.from(transaction["sqrtPrice"]))) :
                parseFloat((0, utils_1.getPrice)(name, amountsInverted, ethers_1.BigNumber.from(transaction["sqrtPrice"])));
            const oneTokenTotalAmount = (amountsInverted ? (0, utils_1.BNtoNumberWithoutDecimals)(transaction["totalAmount1"], 18) : (0, utils_1.BNtoNumberWithoutDecimals)(transaction["totalAmount0"], 18));
            const scarceTokenTotalAmount = (amountsInverted ? (0, utils_1.BNtoNumberWithoutDecimals)(transaction["totalAmount0"], decimals) : (0, utils_1.BNtoNumberWithoutDecimals)(transaction["totalAmount1"], decimals));
            const type = packet.type;
            let holder = {
                'date': date,
                "oneTokenAmount": oneTokenAmount,
                "scarceTokenAmount": scarceTokenAmount,
                "price": price,
                "oneTokenTotalAmount": oneTokenTotalAmount,
                "scarceTokenTotalAmount": scarceTokenTotalAmount,
                'type': type
            };
            verboseTransactions.push(holder);
        }
        isDeposit = false;
    }
    console.log(`The number of unique users for the ${name} vault is ${unique_users.size}`);
    verboseTransactions.sort(utils_1.compare);
    return verboseTransactions;
}
exports.getVerboseTransactions = getVerboseTransactions;
function getDistilledTransactions(verboseTransactions) {
    let distilledTransactions = [];
    for (const transaction of verboseTransactions) {
        let dollarAmount = (0, utils_1.getDollarAmount)(transaction);
        if (transaction.type == 'deposit') {
            dollarAmount = -dollarAmount;
        }
        const holder = { 'amount': dollarAmount, 'when': transaction.date };
        distilledTransactions.push(holder);
    }
    return distilledTransactions;
}
exports.getDistilledTransactions = getDistilledTransactions;
//# sourceMappingURL=data.js.map