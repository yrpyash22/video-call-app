import dotenv from "dotenv";
// It load var from .env file to process.env Object.
dotenv.config();

import express from "express";
import { createServer } from "node:http";
// import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import connectToSocket from "./controllers/socketManage.js";
import userRouts from "./routes/user.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const dburl = process.env.Db_URL;

// Middlewares
app.set("port" , (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded( {limit: "40kb", extended: true}));

app.use("/api/v1/users", userRouts);




const start = async () =>{
    // app.set("mongo_user");

    const connectionDB = await mongoose.connect(dburl);
    console.log(`Mongo connect: ${connectionDB.connection.host}`);
    
    server.listen(app.get("port"), () =>{
        console.log("Listning on port 8000");
    });
}

start();