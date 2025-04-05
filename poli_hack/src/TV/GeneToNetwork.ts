// @ts-ignore
import * as path from "path";

export async function getNetworkForGene(geneCode: any): Promise<string[]> {
    // const BASE_URL = "https://rest.kegg.jp/";
    // const BASE_URL = "http://localhost:3002/api/kegg-genes/";  // Proxy URL
    const BASE_URL = "http://localhost:3002/api/kegg-genes/";

    try {
        const pathwaysUrl = `${BASE_URL}${geneCode}`;
        console.log(pathwaysUrl)
        const pathwaysResponse = await fetch(pathwaysUrl);

        if (!pathwaysResponse.ok) {
            console.error(`❌ Failed to fetch data for ${geneCode}`);
            return [];
        }

        const pathwaysData = await pathwaysResponse.text();

        // Extragem toate codurile care încep cu N0 și sunt urmate de 4 cifre
        const matches = pathwaysData.match(/\bN0\d{4}\b/g);

        if (!matches || matches.length === 0) {
            console.log("ℹ️ Niciun cod N0 găsit.");
            return [];
        }

        return matches;

    } catch (error) {
        console.error("🔥 Eroare la fetch sau parsing KEGG:", error);
        return [];
    }
}


