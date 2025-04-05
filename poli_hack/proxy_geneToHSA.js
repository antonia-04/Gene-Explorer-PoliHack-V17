const express = require('express');
const fetch = require('node-fetch'); // If using Node 18+, use global fetch
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors()); // Allow requests from frontend

app.get('/api/kegg-genes/:geneName', async (req, res) => {
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


app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});