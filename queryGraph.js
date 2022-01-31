"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subgraph_query = void 0;
const pkg = require("@apollo/client");
require("cross-fetch/dist/node-polyfill.js");
const { ApolloClient, InMemoryCache, gql } = pkg;
const config_1 = require("./config");
const data_1 = require("./data");
function subgraph_query(name, endpoint) {
    var client = new ApolloClient({
        uri: endpoint,
        cache: new InMemoryCache(),
    });
    client
        .query({
        query: gql(config_1.tokensQuery),
    })
        .then((data) => {
        //console.log(JSON.stringify(data,null,2))
        (0, data_1.parseData)(name, data);
    })
        .catch((err) => {
        console.log('Error fetching data: ', err);
    });
}
exports.subgraph_query = subgraph_query;
