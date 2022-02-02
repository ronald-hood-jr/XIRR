import { Vault, VAULTS } from "./config";
import * as pkg from '@apollo/client';
import 'cross-fetch/dist/node-polyfill.js';
import { subgraph_query } from "./queryGraph";
const { ApolloClient, InMemoryCache, gql } = pkg;

var vaultHolder: Vault[]=[];
for (const [name, endpoint] of VAULTS){
    vaultHolder.push(new Vault(name))
    const rawData = subgraph_query(VAULTS.get(name))
}

async function dataProcessing(){}