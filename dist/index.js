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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const queryGraph_1 = require("./queryGraph");
const vault_1 = require("./vault");
const fs = __importStar(require("fs"));
(async () => {
    var vaultHolder = [];
    for (const [vaultName, vaultEndpoint] of config_1.VAULTS) {
        let data = await (0, queryGraph_1.subgraph_query)(vaultEndpoint);
        writeDataToDisk(vaultName, data);
        let vault = new vault_1.Vault(vaultName, vaultEndpoint, data);
        await vault.calcCurrentValue();
        await vault.getAPR();
        vaultHolder.push(vault);
    }
})();
function writeDataToDisk(name, data) {
    fs.writeFile('./prints/' + name + '.json', JSON.stringify(data, null, 2), (err) => {
        if (err)
            throw err;
        console.log('The file has been saved!');
    });
}
//# sourceMappingURL=index.js.map