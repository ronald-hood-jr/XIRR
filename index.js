"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
var vaultHolder = [];
for (const [name, endpoint] of config_1.VAULTS) {
    vaultHolder.push(new config_1.Vault(name));
}
