"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subgraph_query = void 0;
const pkg = require("@apollo/client");
require("cross-fetch/dist/node-polyfill.js");
const { ApolloClient, InMemoryCache, gql } = pkg;
const config_1 = require("./config");
async function subgraph_query(endpoint) {
    //pkg.ApolloQueryResult<any>;
    var client = new ApolloClient({
        uri: endpoint,
        cache: new InMemoryCache(),
    });
    client
        .query({
        query: gql(config_1.tokensQuery),
    })
        .then((data) => {
        console.log(`Here is the data:`, JSON.stringify(data, null, 2));
        return (data);
    })
        .catch((err) => {
        console.log('Error fetching data: ', err);
        return (err);
    });
}
exports.subgraph_query = subgraph_query;
