export async function getDrugInfo(drugName: string): Promise<string> {
    if (!drugName?.trim()) {
        return "Drug name is required.";
    }

    const baseUrl = "https://api.fda.gov/drug/label.json";

    const queries = [
        `openfda.brand_name:"${encodeURIComponent(drugName)}"`,
        `openfda.generic_name:"${encodeURIComponent(drugName)}"`
    ];

    for (const query of queries) {
        const endpoint = `${baseUrl}?search=${query}&limit=5`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) continue;

            const data = await response.json();
            if (!data.results || data.results.length === 0) continue;

            const formattedResults = data.results.map((drug: any, index: number) => {
                const openfda = drug.openfda || {};
                const brandName = openfda.brand_name?.[0] || "Unknown";
                const genericName = openfda.generic_name?.[0] || "Unknown";
                const manufacturer = openfda.manufacturer_name?.[0] || "Unknown";
                const purpose = drug.purpose?.[0] || "No purpose info available";

                return `${index + 1}: Brand: ${brandName} | Generic: ${genericName} | Manufacturer: ${manufacturer} | Purpose: ${purpose}`;
            });

            return formattedResults.join('\n');
        } catch (error) {
            continue;
        }
    }

    return `No extra information found.`;
}