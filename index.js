"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const queryGraph_1 = require("./queryGraph");
for (const [name, endpoint] of config_1.VAULTS) {
    (0, queryGraph_1.subgraph_query)(name, endpoint);
}
