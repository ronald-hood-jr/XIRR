"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistilledTransactions = exports.getVerboseTransactions = void 0;
const utils_1 = require("./utils");
function getVerboseTransactions(name, data, amountsInverted) {
    let isDeposit = true;
    let verboseTransactions = [];
    console.log(data);
    for (let transactionType of [data.data.deposits, data.data.withdraws]) {
        for (const transaction of transactionType) {
            const date = new Date(transaction.createdAtTimestamp * 1000);
            const oneTokenAmount = (amountsInverted ? parseInt(transaction["amount1"]) : parseInt(transaction["amount0"]));
            const scarceTokenAmount = (amountsInverted ? parseInt(transaction["amount1"]) : parseInt(transaction["amount0"]));
            const price = isDeposit ? -1 * parseFloat((0, utils_1.getPrice)(name, amountsInverted, parseInt(transaction["sqrtPrice"]))) :
                parseFloat((0, utils_1.getPrice)(name, amountsInverted, parseInt(transaction["sqrtPrice"])));
            const oneTokenTotalAmount = (amountsInverted ? parseInt(transaction["totalAmount1"]) : parseInt(transaction["totalAmount0"]));
            const scarceTokenTotalAmount = (amountsInverted ? parseInt(transaction["totalAmount1"]) : parseInt(transaction["totalAmount0"]));
            const type = isDeposit ? 'deposit' : 'withdrawal';
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
    verboseTransactions.sort(utils_1.compare);
    console.log('verbose data', verboseTransactions);
    return verboseTransactions;
}
exports.getVerboseTransactions = getVerboseTransactions;
function getDistilledTransactions(verboseTransactions) {
    let distilledTransactions = [];
    for (const transaction of verboseTransactions) {
        console.log(`distilled transaction`, transaction);
        const dollarAmount = (0, utils_1.getDollarAmount)(transaction);
        const holder = { 'amount': dollarAmount, 'when': transaction.date };
        distilledTransactions.push(holder);
    }
    return distilledTransactions;
}
exports.getDistilledTransactions = getDistilledTransactions;
