import express from 'express';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
const app = express();
const PORT = process.env.PORT || 3000;
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ye5ib.mongodb.net/myDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors(corsOptions));
app.get('/test', (req, res) => {
  res.send('Test route working!');
});

// langflow connection code 

const BASE_URL = 'https://api.langflow.astra.datastax.com';
const APPLICATION_TOKEN = process.env.LANGFLOW_APP_TOKEN; // Store in .env file
const FLOW_ID = 'b067f448-a52d-4d3d-a4b7-c05ecb40025c';
const LANGFLOW_ID = '22c0277d-7cf1-499a-bcef-6bd3be691afe';

// Function to call Langflow API
async function callLangflow(inputValue, inputType = 'chat', outputType = 'chat', stream = false) {
    const url = `${BASE_URL}/lf/${LANGFLOW_ID}/api/v1/run/${FLOW_ID}?stream=${stream}`;
    const headers = {
        'Authorization': `Bearer ${APPLICATION_TOKEN}`,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        input_value: inputValue,
        input_type: inputType,
        output_type: outputType,
        tweaks: {
            "Agent-lPYNg": {},
            "ChatOutput-MGo4F": {},
            "Prompt-oJJGM": {},
            "ChatInput-1j3ni": {}
        }
    });
    
    try {
        const response = await fetch(url, { method: 'POST', headers, body });
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseData)}`);
        }
        return responseData;
    } catch (error) {
        console.error('Langflow API Error:', error.message);
        throw error;
    }
}

// API route to handle requests
app.post('/run-langflow', async (req, res) => {
    const { inputValue, inputType, outputType, stream } = req.body;
    
    if (!inputValue) {
        return res.status(400).json({ error: 'inputValue is required' });
    }

    try {
        const result = await callLangflow(inputValue, inputType, outputType, stream);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






























app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
