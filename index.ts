import { VAULTS } from "./config";
import { Vault } from "./vault";

var vaultHolder: Vault[]=[];
for (const [vaultName, vaultEndpoint] of VAULTS){
    vaultHolder.push(new Vault(vaultName, vaultEndpoint))
}