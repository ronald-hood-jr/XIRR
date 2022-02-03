import { VAULTS } from "./config";
import { subgraph_query } from "./queryGraph";
import { Vault } from "./vault";
import * as pkg from '@apollo/client';

(async () => {
    var vaultHolder: Vault[]=[];
    for (const [vaultName, vaultEndpoint] of VAULTS){
        let data = await subgraph_query(vaultEndpoint)
        //console.log(data)
        let vault = new Vault(vaultName, vaultEndpoint, data as pkg.ApolloQueryResult<any>)
        await vault.calcCurrentValue()
        await vault.getAPR()
        vaultHolder.push(vault)
    }
})();
