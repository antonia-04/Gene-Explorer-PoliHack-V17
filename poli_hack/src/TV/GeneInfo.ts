export async function getGeneInfo(gene: String): Promise<any> {
    const BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";

    try {
        // Step 1: Get Gene ID
        const esearchUrl = `${BASE_URL}esearch.fcgi?db=gene&term=${gene}[gene]+AND+Homo+sapiens[orgn]&retmode=json`;
        const esearchResponse = await fetch(esearchUrl);
        const esearchData = await esearchResponse.json();

        const idList = esearchData?.esearchresult?.idlist;
        if (!idList || idList.length === 0) {
            return null; // Gene not found
        }

        const geneId = idList[0];

        // Step 2: Get Gene Summary
        const esummaryUrl = `${BASE_URL}esummary.fcgi?db=gene&id=${geneId}&retmode=json`;
        const esummaryResponse = await fetch(esummaryUrl);
        const summaryData = await esummaryResponse.json();

        const geneInfo = summaryData?.result?.[geneId];
        if (!geneInfo) {
            return null; // Info not available
        }

        // Step 3: Keep only specific attributes
        const filteredInfo = {
            name: geneInfo.name,
            nomenclaturename: geneInfo.nomenclaturename,
            summary: geneInfo.summary,
            otherdesignations: geneInfo.otherdesignations,
            geneticsource: geneInfo.geneticsource,
            maplocation: geneInfo.maplocation,
            otheraliases: geneInfo.otheraliases
        };

        // Getters
        const getters = {
            getName: () => filteredInfo.name,
            getNomenclatureName: () => filteredInfo.nomenclaturename,
            getSummary: () => filteredInfo.summary,
            getOtherDesignations: () => filteredInfo.otherdesignations,
            getGeneticSource: () => filteredInfo.geneticsource,
            getMapLocation: () => filteredInfo.maplocation,
            getOtherAliases: () => filteredInfo.otheraliases
        };

        return getters;

    } catch (error) {
        console.error("Error fetching gene info:", error);
        return null;
    }
}

export function generateGeneList(input: string, geneNames: any): string[] {
    const result: string[] = [];

    // Verifică dacă geneNames este un array valid
    if (Array.isArray(geneNames)) {
        geneNames.forEach(gene => {
            result.push(input, "Similar", gene);
        });
    } else {
        console.error("Eroare: geneNames nu este un array valid.");
    }

    return result;
}
