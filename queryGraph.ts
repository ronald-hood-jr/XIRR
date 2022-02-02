import * as pkg from '@apollo/client';
import { ApolloQueryResult } from '@apollo/client';
import 'cross-fetch/dist/node-polyfill.js';
const { ApolloClient, InMemoryCache, gql }  = pkg;
import { tokensQuery, Vault } from "./config";
import { parseData } from "./data";

async function subgraph_query(endpoint: string): Promise<pkg.ApolloQueryResult<any>>{
  //pkg.ApolloQueryResult<any>;
  var client = new ApolloClient({
      uri: endpoint,
      cache: new InMemoryCache(),
    })
    client
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => { 
          console.log(`Here is the data:`,JSON.stringify(data,null,2))
          return(data)
        })
      .catch((err) => {
        console.log('Error fetching data: ', err)
        return(err)
      })
  
}

export {subgraph_query}