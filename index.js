import express  from "express";
import dotenv from 'dotenv';
import { appRouter } from "./src/app.route.js";
import connectDB from "./DB/connection.js";


dotenv.config()
const app = express()
const port = process.env.PORT
connectDB()
// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//Rouning
appRouter(app,express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`));