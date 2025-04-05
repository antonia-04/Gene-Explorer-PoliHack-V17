export async function getNetworkGeneSymbols(networkCode: any): Promise<any> {
    // const url = `https://rest.kegg.jp/get/${networkCode}`;
    const url = `http://localhost:3009/api/kegg-symbol/${networkCode}`;  // Proxy URL
    // const url = `http://localhost:3003/api/kegg-genes/${networkCode}`;  // Proxy URL

    const symbolToInteraction: Record<string, string> = {
        '->': 'Activation',
        '+': 'Activation', // '+' înlocuit cu 'creștere' mai târziu
        '-|': 'Inhibition',
        '==': 'Complex formation',
        '⌿': 'Missing interaction or reaction',
        '⇒': 'Expression',
        '⫤': 'Repression',
        '—': 'Substrate binding to enzyme or transporter',
        '→': 'Enzymatic reaction or transport process',
        '⇉': 'Enzyme-enzyme relation of successive reactions',
    };

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`❌ Eroare la fetch pentru ${networkCode}`);
            return null;
        }

        const text = await response.text();
        const definitionMatch = text.match(/^DEFINITION\s+(.+)$/m);
        const definition = definitionMatch ? definitionMatch[1].trim() : '';
        if (!definition) return [];

        // Înlocuim '+' cu ' creștere ' (cu spații înainte și după)
        let modifiedDefinition = definition.replace(/\+/g, ' + ');

        // Separa cuvintele pe baza spațiilor
        const tokens = modifiedDefinition.split(/\s+/);
        const triplets: string[] = [];


        for (let i = 0; i < tokens.length - 2; i += 2) {
            let source = tokens[i];
            let symbol = tokens[i + 1];

            // Verificăm și înlocuim simbolurile pentru interacțiuni
                symbol = symbolToInteraction[symbol] || 'Edge';

            // Adăugăm tripletul
            triplets.push(source, symbol);
        }
        triplets.push(tokens[tokens.length - 1]);
        return triplets;
    } catch (error) {
        console.error('🔥 Eroare în timpul procesării KEGG:', error);
        return null;
    }
}
