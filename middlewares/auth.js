require("dotenv").config()
const jwt = require("jsonwebtoken");
const redisClient = require("../helpers/redis");


const authenticator = async (req, res, next) => {

    try {
        const token = req.headers?.authorization?.split(" ")[1];

        if (!token) return res.status(401).send({msg:"Please login again"});

        const isTokenValid = await jwt.verify(token, process.env.JWT_SECRET);

        if (!isTokenValid) return res.send({msg:"Authentication failed, Please login again"});

        const isTokenBlacklisted = await redisClient.get(token);
        console.log(isTokenBlacklisted)

        if (isTokenBlacklisted) return res.send({msg:"Unauthorized"});

        req.body.userId = isTokenValid.userId;

        next()

    } catch (err) {
        res.send(err.message);
    }
};

module.exports = { authenticator };