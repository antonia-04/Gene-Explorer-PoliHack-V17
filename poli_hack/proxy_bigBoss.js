const express = require('express');
const fetch = require('node-fetch'); // If using Node 18+, use global fetch
const cors = require('cors');

const app = express();
const PORT = 3009;

app.use(cors()); // Allow requests from frontend

app.get('/api/kegg-genesCode/:geneName', async (req, res) => {
    const geneName = req.params.geneName;
    const KEGG_URL = `https://rest.kegg.jp/find/genes/${geneName}`;

    try {
        const response = await fetch(KEGG_URL);
        if (!response.ok) throw new Error("Failed to fetch from KEGG");

        const rawText = await response.text();

        // Parse the data like you do on frontend
        const filteredGeneCodes = rawText
            .split("\n")
            .filter(line => line.startsWith("hsa") && line.toLowerCase().includes(geneName.toLowerCase()))
            .map(line => line.split("\t")[0]);

        res.json(filteredGeneCodes);
    } catch (err) {
        console.error("❌ Backend error:", err);
        res.status(500).json({ error: "Error fetching data from KEGG" });
    }
});

app.get('/api/kegg-network/:geneCode', async (req, res) => {
    const geneCode = req.params.geneCode;
    const keggUrl = `https://rest.kegg.jp/get/${geneCode}`;

    try {
        const response = await fetch(keggUrl);
        if (!response.ok) {
            return res.status(500).json({ error: 'Failed to fetch data from KEGG API' });
        }

        const data = await response.text();
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from KEGG API' });
    }
});

app.get('/api/kegg-symbol/:networkCode', async (req, res) => {
    const { networkCode } = req.params;  // Extract networkCode from the request URL
    const keggUrl = `https://rest.kegg.jp/get/${networkCode}`;  // KEGG API URL

    try {
        // Make the request to KEGG API
        const response = await fetch(keggUrl);

        if (!response.ok) {
            return res.status(500).json({ error: `Failed to fetch data for ${networkCode}` });
        }

        const data = await response.text();

        // Send the KEGG data as the response
        res.send(data);

    } catch (error) {
        console.error('Error fetching KEGG data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});