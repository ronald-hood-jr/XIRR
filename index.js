"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const pkg = require("@apollo/client");
require("cross-fetch/dist/node-polyfill.js");
const queryGraph_1 = require("./queryGraph");
const { ApolloClient, InMemoryCache, gql } = pkg;
var vaultHolder = [];
for (const [name, endpoint] of config_1.VAULTS) {
    vaultHolder.push(new config_1.Vault(name));
    const rawData = (0, queryGraph_1.subgraph_query)(config_1.VAULTS.get(name));
}
