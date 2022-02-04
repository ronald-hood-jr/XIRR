"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseData = void 0;
const univ3prices = require('@thanpolas/univ3prices');
var xirr = require('xirr');
function parseData(name, data) {
    const deposit_transactions = new Map();
    const withdrawal_transactions = new Map();
    for (let deposit of data.data.deposits) {
        let date = new Date(deposit.createdAtTimestamp * 1000);
        let price = parseFloat(getPrice(name, parseInt(deposit["sqrtPrice"])));
        let holder = new Map();
        holder.set("amount0", parseInt(deposit["amount0"]));
        holder.set("amount1", parseInt(deposit["amount1"]));
        holder.set("price", price);
        holder.set("totalAmount0", parseInt(deposit["totalAmount0"]));
        holder.set("totalAmount1", parseInt(deposit["totalAmount1"]));
        deposit_transactions.set(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), holder);
    }
    for (let withdrawal of data.data.withdraws) {
        let date = new Date(withdrawal.createdAtTimestamp * 1000);
        let price = parseFloat(getPrice(name, parseInt(withdrawal["sqrtPrice"])));
        let holder = new Map();
        holder.set("amount0", parseInt(withdrawal["amount0"]));
        holder.set("amount1", parseInt(withdrawal["amount1"]));
        holder.set("price", price);
        holder.set("totalAmount0", parseInt(withdrawal["totalAmount0"]));
        holder.set("totalAmount1", parseInt(withdrawal["totalAmount1"]));
        withdrawal_transactions.set(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), holder);
    }
    writeData(name, deposit_transactions, withdrawal_transactions);
}
exports.parseData = parseData;
function getPrice(name, sqrtPrice) {
    var price;
    switch (name) {
        case "ichi":
            price = univ3prices([18, 9], sqrtPrice).toSignificant({
                reverse: false,
                decimalPlaces: 3,
            });
            break;
        case "fuse":
            price = univ3prices([18, 18], sqrtPrice).toSignificant({
                reverse: true,
                decimalPlaces: 3,
            });
            break;
        case "wing":
            price = univ3prices([18, 9], sqrtPrice).toSignificant({
                reverse: false,
                decimalPlaces: 3,
            });
            break;
        case "fox":
            price = univ3prices([18, 18], sqrtPrice).toSignificant({
                reverse: false,
                decimalPlaces: 3,
            });
            break;
    }
    return price;
}
function writeData(name, deposit_transactions, withdrawal_transactions) {
    switch (name) {
        case "ichi": {
            let ichiTransactions = [];
            let oneTokenDecimals = 18;
            let scarceTokenDecimals = 9;
            for (const [key, value] of deposit_transactions) {
                setTransactions(name, value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, value.get('price'), key, ichiTransactions, false);
            }
            for (const [key, value] of withdrawal_transactions) {
                setTransactions(name, value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, value.get('price'), key, ichiTransactions, true);
            }
            ichiTransactions = ichiTransactions.sort(compare);
            if (deposit_transactions.has(ichiTransactions[ichiTransactions.length - 1]['when'])) {
                let holder = deposit_transactions.get(ichiTransactions[ichiTransactions.length - 1]['when']);
                ichiTransactions.push({ amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, holder.get('price'), true),
                    when: ichiTransactions[ichiTransactions.length - 1]['when'] });
            }
            else {
                let holder = withdrawal_transactions.get(ichiTransactions[ichiTransactions.length - 1]['when']);
                ichiTransactions.push({ amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, holder.get('price'), true),
                    when: ichiTransactions[ichiTransactions.length - 1]['when'] });
            }
            //console.dir(ichiTransactions, {'maxArrayLength': null});
            getXIRR(name, ichiTransactions);
            break;
        }
        case "fuse": {
            let fuseTransactions = [];
            let oneTokenDecimals = 18;
            let scarceTokenDecimals = 18;
            for (const [key, value] of deposit_transactions) {
                setTransactions(name, value.get('amount1'), value.get('amount0'), value.get('totalAmount1'), value.get('totalAmount0'), oneTokenDecimals, scarceTokenDecimals, value.get('price'), key, fuseTransactions, false);
            }
            for (const [key, value] of withdrawal_transactions) {
                setTransactions(name, value.get('amount1'), value.get('amount0'), value.get('totalAmount1'), value.get('totalAmount0'), oneTokenDecimals, scarceTokenDecimals, value.get('price'), key, fuseTransactions, true);
            }
            fuseTransactions = fuseTransactions.sort(compare);
            if (deposit_transactions.has(fuseTransactions[fuseTransactions.length - 1]['when'])) {
                let holder = deposit_transactions.get(fuseTransactions[fuseTransactions.length - 1]['when']);
                fuseTransactions.push({ amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, holder.get('price'), true),
                    when: fuseTransactions[fuseTransactions.length - 1]['when'] });
            }
            else {
                let holder = withdrawal_transactions.get(fuseTransactions[fuseTransactions.length - 1]['when']);
                fuseTransactions.push({ amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, holder.get('price'), true),
                    when: fuseTransactions[fuseTransactions.length - 1]['when'] });
            }
            //console.dir(fuseTransactions, {'maxArrayLength': null});
            getXIRR(name, fuseTransactions);
            break;
        }
        case "wing": {
            let wingTransactions = [];
            let oneTokenDecimals = 18;
            let scarceTokenDecimals = 9;
            for (const [key, value] of deposit_transactions) {
                setTransactions(name, value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, value.get('price'), key, wingTransactions, false);
            }
            for (const [key, value] of withdrawal_transactions) {
                setTransactions(name, value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, value.get('price'), key, wingTransactions, true);
            }
            wingTransactions = wingTransactions.sort(compare);
            if (deposit_transactions.has(wingTransactions[wingTransactions.length - 1]['when'])) {
                let holder = deposit_transactions.get(wingTransactions[wingTransactions.length - 1]['when']);
                wingTransactions.push({ amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, holder.get('price'), true),
                    when: wingTransactions[wingTransactions.length - 1]['when'] });
            }
            else {
                let holder = withdrawal_transactions.get(wingTransactions[wingTransactions.length - 1]['when']);
                wingTransactions.push({ amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, holder.get('price'), true),
                    when: wingTransactions[wingTransactions.length - 1]['when'] });
            }
            //console.dir(wingTransactions, {'maxArrayLength': null});
            getXIRR(name, wingTransactions);
            break;
        }
        case "fox": {
            let foxTransactions = [];
            let oneTokenDecimals = 18;
            let scarceTokenDecimals = 18;
            for (const [key, value] of deposit_transactions) {
                setTransactions(name, value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, value.get('price'), key, foxTransactions, false);
            }
            for (const [key, value] of withdrawal_transactions) {
                setTransactions(name, value.get('amount0'), value.get('amount1'), value.get('totalAmount0'), value.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, value.get('price'), key, foxTransactions, true);
            }
            foxTransactions = foxTransactions.sort(compare);
            if (deposit_transactions.has(foxTransactions[foxTransactions.length - 1]['when'])) {
                let holder = deposit_transactions.get(foxTransactions[foxTransactions.length - 1]['when']);
                foxTransactions.push({ amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, holder.get('price'), true),
                    when: foxTransactions[foxTransactions.length - 1]['when'] });
            }
            else {
                let holder = withdrawal_transactions.get(foxTransactions[foxTransactions.length - 1]['when']);
                foxTransactions.push({ amount: getUSD(name, holder.get('totalAmount0'), holder.get('totalAmount1'), oneTokenDecimals, scarceTokenDecimals, holder.get('price'), true),
                    when: foxTransactions[foxTransactions.length - 1]['when'] });
            }
            //console.dir(foxTransactions, {'maxArrayLength': null});
            getXIRR(name, foxTransactions);
            break;
        }
    }
}
function compare(a, b) {
    if (a['when'] > b['when']) {
        return 1;
    }
    else if (b['when'] > a['when']) {
        return -1;
    }
    else {
        return 0;
    }
}
function getUSD(name, oneTokenAmount, scarceTokenAmount, oneTokenDecimals, scarceTokenDecimals, price, isWithdrawal) {
    let amount = oneTokenAmount / 10 ** oneTokenDecimals + scarceTokenAmount / 10 ** scarceTokenDecimals * price;
    if (isWithdrawal) {
        return amount;
    }
    else {
        return -1 * amount;
    }
}
function setTransactions(name, oneTokenAmount, scarceTokenAmount, oneTokenTotalAmount, scarceTokenTotalAmount, oneTokenDecimals, scarceTokenDecimals, price, date, transactions, isWithdraw) {
    transactions.push({ amount: getUSD(name, oneTokenAmount, scarceTokenAmount, oneTokenDecimals, scarceTokenDecimals, price, isWithdraw), when: date });
}
//returns IRR
function getXIRR(name, transactions) {
    var rate = xirr(transactions, { guess: -0.99 });
    console.log(`The IRR of the ${name} vault is `, rate);
    getAPR(name, transactions);
}
function getAPR(name, transactions) {
    let deposits = 0;
    let withdrawals = 0;
    for (let i = 0; i < transactions.length - 1; i++) {
        let amount = transactions[i]['amount'];
        if (amount > 0) {
            withdrawals += amount;
        }
        else {
            deposits += (amount * -1);
        }
    }
    let APR = (withdrawals / deposits * 100 - 100) / ((transactions[transactions.length - 1]['when'].getTime() - transactions[1]['when'].getTime()) / 1000.0 / 365 / 24 / 60 / 60);
    console.log(`The APR of the ${name} vault is: ${APR}`);
}
//# sourceMappingURL=data.js.map