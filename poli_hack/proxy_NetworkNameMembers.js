const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 3003;  // Proxy server runs on port 3002

// Enable CORS to allow your frontend to access the proxy
app.use(cors());

// Route to handle the request to fetch KEGG network data
app.get('/api/kegg-genes/:networkCode', async (req, res) => {
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

// Start the proxy server on port 3002
app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
