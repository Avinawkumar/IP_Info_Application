const express = require('express');
const ipinforouter = express.Router();


const axios = require("axios");

const redisClient = require('../helpers/redis');


// get city by ip router
ipinforouter.get("/:ip", async(req,res) =>{
    try {


        const ip = req.params.ip
        console.log(ip)

        // checking if this ip is present in redis or not
        const isIPInCache = await redisClient.get(`${ip}`);

        console.log(isIPInCache)

        if (isIPInCache) return res.status(200).send({ city: isIPInCache });


        const response = await axios.get(`https://ipapi.co/${ip}/json/`)

        console.log(response.data)


        // console.log(weatherData)

        redisClient.set(ip, (response.data.city), { EX: 60*6 * 60 });


        return res.send({ city: response.data.city });


    } catch (err) {
        return res.status(500).send(err.messsage);
    }
})




module.exports= ipinforouter;
