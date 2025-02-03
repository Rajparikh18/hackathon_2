
import express from 'express';
import mongoose from 'mongoose';
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/test', (req, res) => {
  res.send('Test route working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
