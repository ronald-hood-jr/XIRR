import * as pkg from '@apollo/client';
import 'cross-fetch/dist/node-polyfill.js';
const { ApolloClient, InMemoryCache, gql }  = pkg;

async function subgraph_query(endpoint: string, page: number, tokensQuery) {
  var client = new ApolloClient({
      uri: endpoint,
      cache: new InMemoryCache(),
    })
    return await client
      .query({
        query: gql(tokensQuery),
        variables: {
          first: 1,
          skip: (page-1)*1,
        },
      })
}

export {subgraph_query}