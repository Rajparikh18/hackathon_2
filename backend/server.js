import express from 'express';
import mongoose from 'mongoose';
const app = express();
const PORT = process.env.PORT || 3000;
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

console.log('MongoDB Username:', process.env.MONGO_USERNAME);
console.log('MongoDB Password:', process.env.MONGO_PASSWORD);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ye5ib.mongodb.net/myDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors(corsOptions));

class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint, body, headers = {}) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        const url = `${this.baseURL}${endpoint}`;
    
        try {
            const formData = new FormData();
            formData.append('image', body.image); 

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseData)}`);
            }
            return responseData;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }
}

const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com', process.env.FOOD_RECOGNITION);

app.post('/processImage', async (req, res) => {
    try {
        const imageData = req.body.image; 
        const endpoint = '/lf/22c0277d-7cf1-499a-bcef-6bd3be691afe/api/v1/run/5faea2f5-f1f9-437b-a0a0-0fcfc50fe584';

        const response = await langflowClient.post(endpoint, { image: imageData });

        res.json(response);
    } catch (error) {
        console.error('Processing Error:', error.message);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

app.get('/test', (req, res) => {
  res.send('Test route working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
