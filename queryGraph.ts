import * as pkg from '@apollo/client';
import 'cross-fetch/dist/node-polyfill.js';
const { ApolloClient, InMemoryCache, gql }  = pkg;
import { tokensQuery, Vault } from "./config";
import { parseData } from "./data";

function subgraph_query(name: string, endpoint: string, vault: Vault): pkg.ApolloQueryResult<any>{
  let returnData: pkg.ApolloQueryResult<any>;
  var client = new ApolloClient({
      uri: endpoint,
      cache: new InMemoryCache(),
    })
    client
      .query({
        query: gql(tokensQuery),
      })
        .then((data) => {
          parseData(name, data, vault)
          console.log(`Here is the data:`,JSON.stringify(data,null,2))
          returnData = data
          
        })
          .catch((err) => {
          console.log('Error fetching data: ', err)
          })
  return(returnData)
}

export {subgraph_query}