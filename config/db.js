const mongoose  = require('mongoose');
require("dotenv").config()

const connected_to_mongoAtlas = mongoose.connect(process.env.mongo_atlas_url)



module.exports = connected_to_mongoAtlas
