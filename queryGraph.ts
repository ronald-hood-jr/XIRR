import * as pkg from '@apollo/client';
import 'cross-fetch/dist/node-polyfill.js';
const { ApolloClient, InMemoryCache, gql }  = pkg;
import { tokensQuery } from "./config";
import {parseData} from "./data";

function subgraph_query(name: string, endpoint: string){
    var client = new ApolloClient({
        uri: endpoint,
        cache: new InMemoryCache(),
      })
      client
        .query({
          query: gql(tokensQuery),
        })
          .then((data) => {
            //console.log(JSON.stringify(data,null,2))
            parseData(name, data)
          })
            .catch((err) => {
            console.log('Error fetching data: ', err)
            })
}

export {subgraph_query}