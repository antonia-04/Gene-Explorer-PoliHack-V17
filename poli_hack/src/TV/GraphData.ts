import { getGeneInfo, } from './GeneInfo';
import {generateGeneList} from './GeneInfo'
import { getTop20GeneInteractions } from './GenetoDrugDetails';
import { getKeggGeneCodes } from './GeneCode';
import { getNetworkForGene } from './GeneToNetwork';
import { getNetworkGeneSymbols } from './NeworkNameMembers';

export async function getGraphData(geneInput: string) {
    try {
        // Obține codul genei utilizând funcția getKeggGeneCode
        let geneCodes = await getKeggGeneCodes(geneInput); // Așteptăm să obținem rezultatul

        const geneNetworks2 = geneCodes.map(code => getNetworkForGene(code));
        // Obține rețelele pentru gena respectivă


        if (!geneNetworks2) {
            console.log("❌ Nu s-au găsit rețele pentru această genă.");
            return;
        }
        const geneNetworks3 = await Promise.all(geneNetworks2);

        // "Planuim" rețelele, adică le punem toate într-o singură listă
        const geneNetworks = geneNetworks3.flat().filter(network => network);

        // Crează o listă pentru toate simbolurile genelor
        let allGeneSymbols = [];

        // Parcurge fiecare element din rețelele de gene și aplică funcția getNetworkGeneSymbols
        for (let value of geneNetworks) {
            let geneSymbols = await getNetworkGeneSymbols(value);
            if (geneSymbols) {
                allGeneSymbols.push(geneSymbols); // "Platizează" lista (adaugă toate simbolurile la lista principală)
            }
        }
        const getters = await getGeneInfo(geneInput)
        if (getters) {
            let stringList = getters.getOtherAliases()?.split(",") || [];
            let similarList = generateGeneList(geneInput, stringList);
            allGeneSymbols.push(similarList);
            console.log("🔁 Simboluri ale genelor extrase:", allGeneSymbols);
        }
        return allGeneSymbols;
    } catch (error) {
        console.error("🔥 Eroare la obținerea datelor:", error);
    }
}
