import * as pkg from '@apollo/client';
import 'cross-fetch/dist/node-polyfill.js';
const { ApolloClient, InMemoryCache, gql }  = pkg;
import { tokensQuery } from "./config";

async function subgraph_query(endpoint: string) {
  var client = new ApolloClient({
      uri: endpoint,
      cache: new InMemoryCache(),
    })
    return await client
      .query({
        query: gql(tokensQuery),
      })
}

export {subgraph_query}