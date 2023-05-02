const express = require('express');
const mongoose = require('mongoose');
const connected_to_mongoAtlas = require('./config/db');
const userRouter = require('./routes/user.route');
const redisClient = require('./helpers/redis');
const { authenticator } = require('./middlewares/auth');
const ipinforouter = require('./routes/IPinfo.route');
const logger = require('./middlewares/logger');






require("dotenv").config() // using .env for port and db
const app = express();

app.use(express.json()); // ==> important;


// app.get("/", async(req,res)=>{
//     res.send("c4eval HOme");
// })
app.get("/", authenticator, async(req,res)=>{
    res.send(await redisClient.get("name"));
})


app.use("/users",  userRouter)

app.use("/getdata", authenticator, ipinforouter)

// app.use(authMiddleware)
// app.get("/prot", authMiddleware,  (req,res) =>{
//     res.send("procted data")
// })





// exporting the app
module.exports = app

app.listen(process.env.port , async() =>{
    try {
        await connected_to_mongoAtlas
        console.log("connected to mongodb_atlas");
    } catch (error) {
        console.log("not connected to local_mongodb");
        console.log(error);
    }
    console.log(`Server is running on port ${process.env.port}`);
});