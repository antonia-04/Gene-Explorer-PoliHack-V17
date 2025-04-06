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
        //return allGeneSymbols;
        // const normalized = normalizeGeneData(allGeneSymbols);
        // return normalized;

        let geneGroup: { [key: string]: number } = {};
        let nodes: { id: string, group: number }[] = [];
        let links: { source: string, target: string, value: string }[] = [];
        let addedGenes: Set<string> = new Set(); // Track added genes

        allGeneSymbols.forEach((array: string[], groupIndex: number) => {
            array.forEach((gene, index) => {
                // If the gene is not a relationship term, add it to the nodes (if it hasn't been added yet)
                if (gene !== "Complex formation" && gene !== "Activation" && gene !== "Similar" && gene !== "Inhibition") {
                    // Check if the gene has been added before
                    if (!addedGenes.has(gene)) {
                        addedGenes.add(gene);  // Mark the gene as added
                        geneGroup[gene] = groupIndex;  // Assign the group index to the gene
                        nodes.push({ id: gene, group: groupIndex });  // Add the gene to the nodes
                    }
                }

                // Create links only for sublists of the form [gene, relationship, gene]
                if (index < array.length - 2) {
                    const sourceGene = array[index];
                    const relationship = array[index + 1];
                    const targetGene = array[index + 2];

                    // Ensure the source and target are genes, and the relationship is valid
                    if (
                        sourceGene !== "Complex formation" && sourceGene !== "Activation" && sourceGene !== "Similar" && sourceGene !== "Inhibition" &&
                        targetGene !== "Complex formation" && targetGene !== "Activation" && targetGene !== "Similar" && targetGene !== "Inhibition" &&
                        (relationship === "Complex formation" || relationship === "Activation" || relationship === "Similar" || relationship === "Inhibition")
                    ) {
                        links.push({
                            source: sourceGene,
                            target: targetGene,
                            value: relationship  // The relationship type (e.g., "Activation", "Inhibition")
                        });
                    }
                }
            });
        });

// Output the final result
        const jsonResult = {
            nodes: nodes,
            links: links,
        };

        console.log(JSON.stringify(jsonResult, null, 2));

        // return allGeneSymbols;
        return jsonResult;

    } catch (error) {
        console.error("🔥 Eroare la obținerea datelor:", error);
    }

}

function normalizeGeneData(nestedArray: string[][]): string[] {
    const cleaned: string[] = [];

    for (const subArray of nestedArray) {
        for (let element of subArray) {
            // Împărțim după virgulă, dacă există
            const parts = element
                .split(',')
                .map(part => part.replace(/[^a-zA-Z0-9]/g, '').trim())
                .filter(Boolean); // eliminăm stringuri goale

            if (parts.length === 1) {
                cleaned.push(parts[0]);
            } else if (parts.length > 1) {
                for (let i = 0; i < parts.length; i++) {
                    cleaned.push(parts[i]);
                    if (i < parts.length - 1) {
                        cleaned.push("Activation");
                    }
                }
            }
        }
    }

    return cleaned;
}
