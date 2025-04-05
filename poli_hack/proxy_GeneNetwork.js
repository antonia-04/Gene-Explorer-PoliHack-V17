const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 3002;

// Enable CORS for frontend
app.use(cors());

// Proxy route for KEGG API
app.get('/api/kegg-genes/:geneCode', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
