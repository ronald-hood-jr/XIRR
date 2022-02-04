"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BNtoNumberWithoutDecimals = exports.getPrice = exports.getDollarAmount = exports.compare = void 0;
const univ3prices_1 = __importDefault(require("@thanpolas/univ3prices"));
const config_1 = require("./config");
function getPrice(name, isInverted, sqrtPrice) {
    let decimalArray = [config_1.decimalTracker[name].oneToken, config_1.decimalTracker[name].scarceToken];
    let price = (0, univ3prices_1.default)(decimalArray, sqrtPrice).toSignificant({
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
function BNtoNumberWithoutDecimals(val, decimals) {
    if (val != null) {
        const digits = val.length;
        let tempVal = '';
        if (digits <= decimals) {
            tempVal = '0.';
            for (let i = 0; i < decimals - digits; i++) {
                tempVal = `${tempVal}0`;
            }
            tempVal = `${tempVal}${val}`;
        }
        else {
            for (let i = 0; i < digits - decimals; i++) {
                tempVal = `${tempVal}${val[i]}`;
            }
            tempVal = `${tempVal}.`;
            for (let i = digits - decimals; i < digits; i++) {
                tempVal = `${tempVal}${val[i]}`;
            }
        }
        return Number(tempVal);
    }
    return 0;
}
exports.BNtoNumberWithoutDecimals = BNtoNumberWithoutDecimals;
//# sourceMappingURL=utils.js.map