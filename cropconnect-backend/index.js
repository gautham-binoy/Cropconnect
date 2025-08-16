// index.js

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/prices', async (req, res) => {
    // We can now accept an optional 'state' parameter
    const { commodity, date, state } = req.query; 
    const apiKey = process.env.DATA_GOV_API_KEY;

    if (!commodity || !date) {
        return res.status(400).json({ error: 'Missing "commodity" or "date" query parameter.' });
    }
    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: API key not found.' });
    }

    const externalApiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
    
    // --- MODIFICATION START ---
    // Prepare the parameters for the external API call
    const params = {
        'api-key': apiKey,
        'format': 'json',
        'filters[commodity]': commodity,
        'filters[arrival_date]': date,
        'limit': 500 // Increased limit to get more data for filtering
    };

    // If a state is provided by the frontend, add it to the filter
    if (state) {
        params['filters[state]'] = state;
    }
    // --- MODIFICATION END ---

    try {
        const response = await axios.get(externalApiUrl, { params }); // Use the constructed params object
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching from external API:", error.message);
        res.status(502).json({ error: 'Failed to fetch data from the government API.' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ CropConnect backend server is running on http://localhost:${PORT}`);
});