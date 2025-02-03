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
app.get('/test', (req, res) => {
  res.send('Test route working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
