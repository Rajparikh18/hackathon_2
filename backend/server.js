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
app.use(express.json()); 
app.get('/test', (req, res) => {
  res.send('Test route working!');
});

// langflow connection code 

const BASE_URL = 'https://api.langflow.astra.datastax.com';
const APPLICATION_TOKEN = process.env.MACRONUTRIENTS_BREAKDOWN; // Store in .env file
const FLOW_ID = '5faea2f5-f1f9-437b-a0a0-0fcfc50fe584';
const LANGFLOW_ID = '22c0277d-7cf1-499a-bcef-6bd3be691afe';

// Function to call Langflow API ( this is for macroNutrients blueprint);
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
        console.log('Full Response:', JSON.stringify(responseData, null, 2));
        console.log(responseData.outputs[0].outputs[0].outputs.message.message.text);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseData)}`);
        }
        return responseData;
    } catch (error) {
        console.error('Langflow API Error:', error.message);
        throw error;
    }
}

app.post('/macroblueprints', async (req, res) => {
    // Convert JSON input back to a single string input
    const inputValue = Object.entries(req.body)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' ');

    try {
        const result = await callLangflow(inputValue);
        res.json(result);
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ error: error.message });
    }
});

// this is food recommendation 7 day meal plan 
const FOOD_LANGFLOW_ID = process.env.FOOD_RECOMMENDATION_LANGFLOW_ID; // Replace with actual Langflow ID
const Recommendation_application_token=process.env.FOOD_RECOMMENDATION_APPLICATION_TOKEN
async function callFoodLangflow(inputValue, inputType = 'chat', outputType = 'chat', stream = false) {
    const url = `${BASE_URL}/lf/${FOOD_LANGFLOW_ID}/api/v1/run/${FLOW_ID}?stream=${stream}`;
    const headers = {
        'Authorization': `Bearer ${Recommendation_application_token}`, // Assuming the same token
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
        console.log('Food Recommendation Response:', JSON.stringify(responseData, null, 2));

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseData)}`);
        }

        return responseData;
    } catch (error) {
        console.error('Langflow API Error:', error.message);
        throw error;
    }
}

app.post('/foodrecommendation', async (req, res) => {
    const inputValue = Object.entries(req.body)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' ');

    try {
        const result = await callFoodLangflow(inputValue);
        
        // Extracting the text response from Langflow
        const outputMessage = result?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text || "No response received";

        res.json({ recommendation: outputMessage });
    } catch (error) {
        console.error('Food Recommendation Error:', error);
        res.status(500).json({ error: 'Failed to fetch food recommendation' });
    }
});





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
