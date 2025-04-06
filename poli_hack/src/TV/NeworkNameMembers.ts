export async function getNetworkGeneSymbols(networkCode: any): Promise<any> {
    // const url = `https://rest.kegg.jp/get/${networkCode}`;
    const url = `http://localhost:3009/api/kegg-symbol/${networkCode}`;  // Proxy URL
    // const url = `http://localhost:3003/api/kegg-genes/${networkCode}`;  // Proxy URL

//     const symbolToInteraction: Record<string, string> = {
//         '->': 'Activation',
//         '+': 'Activation',
//         '-|': 'Inhibition',
//         '==': 'Complex formation',
//         '//': 'Missing interaction',
//         '=>': 'Expression',
//         '=|': 'Repression',
//         '-': 'Substrate binding to enzyme or transporter',
//         '>>': 'Enzyme-enzyme relation of successive reactions',
//     };
//
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             // console.error("❌ Eroare la fetch pentru " + ${networkCode});
//             return null;
//         }
//
//         const text = await response.text();
//         const definitionMatch = text.match(/^DEFINITION\s+(.+)$/m);
//         let definition = definitionMatch ? definitionMatch[1].trim() : '';
//         if (!definition) return [];
//
//         // 🧼 Elimină parantezele rotunde
//         definition = definition.replace(/[()]/g, '');
//
//         // 🔁 Înlocuiește simbolul '+' cu spațiu pentru delimitare
//         let modifiedDefinition1 = definition.replace(/\+(?=[a-zA-Z])/g, ' + ');
//         let modifiedDefinition = modifiedDefinition1.replace(/,/g, ' + ');
//
//         // 🧩 Tokenizează pe spațiu
//         const tokens = modifiedDefinition.split(/\s+/);
//         const triplets: string[] = [];
//
//         console.log("🧬 Relații extrase din rețea pentru ${networkCode}:\n");
//
//         for (let i = 0; i < tokens.length - 2; i += 2) {
//             let source = tokens[i];
//             let symbol = tokens[i + 1];
//
//             symbol = symbolToInteraction[symbol] || 'Edge';
//
//             triplets.push(source, symbol);
//         }
//
//         // Adaugă ultimul element (target final)
//         triplets.push(tokens[tokens.length - 1]);
//
//         return triplets;
//     } catch (error) {
//         console.error('🔥 Eroare în timpul procesării KEGG:', error);
//         return null;
//     }
// }

    const symbolToInteraction: Record<string, string> = {
        '->': 'Activation',
        '+': 'Activation',
        '-|': 'Inhibition',
        '==': 'Complex formation',
        '//': 'Missing interaction',
        '=>': 'Expression',
        '=|': 'Repression',
        '-': 'Substrate binding to enzyme or transporter',
        '>>': 'Enzyme-enzyme relation of successive reactions',
        '--': 'Starting point in a metabolic pathway'
    };

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`❌ Eroare la fetch pentru ${networkCode}`);
            return null;
        }

        const text = await response.text();
        const definitionMatch = text.match(/^DEFINITION\s+(.+)$/m);
        let definition = definitionMatch ? definitionMatch[1].trim() : '';
        if (!definition) return [];

        // 🧼 Elimină parantezele rotunde
        definition = definition.replace(/[()]/g, '');

        // 🔁 Înlocuiește simbolul '+' cu spațiu pentru delimitare
        let modifiedDefinition1 = definition.replace(/\+(?=[a-zA-Z])/g, ' + ');
        let modifiedDefinition2 = modifiedDefinition1.replace(/-(?=[a-zA-Z])/g, ' - ');
        let modifiedDefinition = modifiedDefinition2.replace(/,/g, ' + ');

        const tokens = modifiedDefinition.split(/\s+/);
        const triplets: string[] = [];

        for (let i = 0; i < tokens.length - 2; i += 2) {
            let source = tokens[i];
            let symbol = tokens[i + 1];

            symbol = symbolToInteraction[symbol] || 'Edge';

            triplets.push(source, symbol);
        }

        // Adaugă ultimul element (target final)
        triplets.push(tokens[tokens.length - 1]);

        return triplets;
    } catch (error) {
        console.error('🔥 Eroare în timpul procesării KEGG:', error);
        return null;
    }
}
