// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/prices', async (req, res) => {
    const { commodity, date } = req.query;
    const apiKey = process.env.DATA_GOV_API_KEY; // <-- See? No key here, just a reference.

    if (!commodity || !date) {
        return res.status(400).json({ error: 'Missing "commodity" or "date" query parameter.' });
    }
    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: API key not found.' });
    }

    // This is the public URL to the dataset
    const externalApiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

    try {
        const response = await axios.get(externalApiUrl, {
            params: {
                'api-key': apiKey, // The secret key is used here, but never written in the file.
                'format': 'json',
                'filters[commodity]': commodity,
                'filters[arrival_date]': date,
                'limit': 100
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching from external API:", error.message);
        res.status(502).json({ error: 'Failed to fetch data from the government API.' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ CropConnect backend server is running on http://localhost:${PORT}`);
});