import { VAULTS } from "./config";
import { subgraph_query } from "./queryGraph";

for (const [name, endpoint] of VAULTS){
    subgraph_query(name, endpoint)
}