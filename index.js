"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const vault_1 = require("./vault");
var vaultHolder = [];
for (const [vaultName, vaultEndpoint] of config_1.VAULTS) {
    vaultHolder.push(new vault_1.Vault(vaultName, vaultEndpoint));
}
