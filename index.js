import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './server/routes/router.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use('/', router);



const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });



app.get('/', (req, res) => {
  res.send('Hello World!')
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})