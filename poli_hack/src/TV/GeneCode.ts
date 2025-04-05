
export async function getKeggGeneCodes(geneName: string): Promise<string[]> {
    try {
        const response = await fetch(`http://localhost:3001/api/kegg-genes/${geneName}`);
        if (!response.ok) {
            throw new Error("Failed to fetch KEGG data from backend");
        }

        const geneCodes: string[] = await response.json();
        return geneCodes;
    } catch (error) {
        console.error("Frontend error fetching gene codes:", error);
        return [];
    }
}
// export async function getKeggGeneCodes(geneName:String) {
// // const BASE_URL = "https://rest.kegg.jp/";
// //
// // try {
// //     // Step 1: Search for genes matching the geneName in KEGG
// //     const esearchUrl = `${BASE_URL}find/genes/${geneName}`;
// //     console.log(esearchUrl)
// //     const esearchResponse = await fetch(esearchUrl)
// //     console.log(esearchResponse)
//
//     try {
//         const response = await fetch(`http://localhost:3001/api/kegg-genes/${geneName}`);
//         if (!response.ok) {
//             throw new Error("Failed to fetch KEGG data from backend");
//         }
//
//         const data = await response.json();
//
//         const esearchData = data
//
//         // Step 2: Split the data by lines and filter for human genes (starting with "hsa")
//         const lines = esearchData.split("\n");
//
//         // Filter lines that start with "hsa" and contain the gene name (case-insensitive)
//         const filteredGeneCodes = lines
//             .filter(line => line.startsWith("hsa") && line.toLowerCase().includes(geneName.toLowerCase()))
//             .map(line => line.split("\t")[0]); // Extract just the gene code (e.g., hsa:672)
//
//         return filteredGeneCodes;
//
//     } catch (error) {
//         console.error("Frontend error fetching gene codes:", error);
//         return [];
//     }
// }
