// index.js (Final Clean Version)

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3001;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
app.use(cors());

app.get('/api/prices', async (req, res) => {
    try {
        const { commodity, date, state } = req.query;
        const apiKey = process.env.DATA_GOV_API_KEY;
        if (!commodity || !date) { return res.status(400).json({ error: 'Missing required query parameters.' }); }
        const externalApiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
        const params = { 'api-key': apiKey, format: 'json', 'filters[commodity]': commodity, 'filters[arrival_date]': date, limit: 500 };
        if (state) { params['filters[state]'] = state; }
        const response = await axios.get(externalApiUrl, { params });
        res.json(response.data);
    } catch (error) {
        console.error("Error in /api/prices:", error);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
});

app.get('/api/summary', async (req, res) => {
    try {
        const { commodity, date, state, lang = 'en' } = req.query;
        const apiKey = process.env.DATA_GOV_API_KEY;
        const externalApiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
        const params = { 'api-key': apiKey, 'format': 'json', 'filters[commodity]': commodity, 'filters[arrival_date]': date, 'limit': 100 };
        if (state) { params['filters[state]'] = state; }
        const priceResponse = await axios.get(externalApiUrl, { params });
        const records = priceResponse.data.records;
        if (!records || records.length === 0) { return res.status(404).json({ summary: "No data available." }); }
        const languageMap = { en: 'English', hi: 'Hindi', ml: 'Malayalam' };
        const targetLanguage = languageMap[lang] || 'English';
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert agricultural market analyst. Based on the following JSON data for ${commodity} prices, write a concise, 3-bullet point summary for a farmer in markdown format. **IMPORTANT: Write the entire summary in the ${targetLanguage} language.** Highlight the most important trend, identify the market with the highest maximum price as a "Top Opportunity", and mention any notable patterns. Respond only with the summary. Data: ${JSON.stringify(records)}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();
        res.json({ summary: summary });
    } catch (error) {
        console.error("Error in /api/summary:", error);
        res.status(500).json({ summary: "Could not generate AI summary." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ CropConnect backend server is running on http://localhost:${PORT}`);
});