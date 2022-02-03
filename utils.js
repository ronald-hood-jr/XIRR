"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrice = exports.getDollarAmount = exports.compare = void 0;
const univ3prices = require("@thanpolas/univ3prices");
const config_1 = require("./config");
function getPrice(name, isInverted, sqrtPrice) {
    let decimalArray = [config_1.decimalTracker[name].oneToken, config_1.decimalTracker[name].scarceToken];
    let price = univ3prices(decimalArray, sqrtPrice).toSignificant({
        reverse: isInverted,
        decimalPlaces: 3
    });
    return price;
}
exports.getPrice = getPrice;
function getDollarAmount(transaction) {
    const oneTokenAmount = transaction.oneTokenAmount;
    const scarceTokenAmount = transaction.scarceTokenAmount;
    const price = transaction.price;
    return (oneTokenAmount + price * scarceTokenAmount);
}
exports.getDollarAmount = getDollarAmount;
function compare(a, b) {
    if (a['date'] > b['date']) {
        return 1;
    }
    else if (b['date'] > a['date']) {
        return -1;
    }
    else {
        return 0;
    }
}
exports.compare = compare;
