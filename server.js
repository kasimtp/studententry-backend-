 import express from 'express';
 import cors from 'cors';
 import dotenv from 'dotenv';
 import path from 'path';
import connectDB from './config/db.js';

 




 const app = express();
 app.use(express.json());
 app.use(cors());
 dotenv.config();

 console.log(process.env.Port);

 const Port = process.env.Port || 3000; 
 connectDB();

 app.get("/", (req, res) => {
     res.send("Hello World! Admin App");
 });

    app.listen(Port, () => {
        console.log(`Server is running on port ${Port}`);});
