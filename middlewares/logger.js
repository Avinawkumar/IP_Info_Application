require("dotenv").config()
const winston = require("winston");

const {MongoDB} = require("winston-mongodb")



const logger = winston.createLogger({
    level:"info",
    format: winston.format.json(),
    transports:[
        new MongoDB ({
            db:process.env.mongo_atlas_url,
            collection:"logs",
            options: {
                useUnifiedTopology:true
            }
        })
    ]
})

module.exports = logger