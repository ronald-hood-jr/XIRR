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
exports.subgraph_query = void 0;
const pkg = __importStar(require("@apollo/client"));
require("cross-fetch/dist/node-polyfill.js");
const { ApolloClient, InMemoryCache, gql } = pkg;
const config_1 = require("./config");
async function subgraph_query(endpoint) {
    var client = new ApolloClient({
        uri: endpoint,
        cache: new InMemoryCache(),
    });
    return await client
        .query({
        query: gql(config_1.tokensQuery),
    });
}
exports.subgraph_query = subgraph_query;
//# sourceMappingURL=queryGraph.js.map