import { Vault, VAULTS } from "./config";

var vaultHolder: Vault[]=[];
for (const [name, endpoint] of VAULTS){
    vaultHolder.push(new Vault(name))
    console.log(`T`)
}