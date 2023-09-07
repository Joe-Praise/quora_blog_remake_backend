let merge = require('lodash.merge');


process.env.NODE_ENV = process.env.NODE_ENV || "development";
const stage = process.env.STAGE || 'local'

let envConfig

if(stage === 'production'){
    envConfig = {port: process.env.PORT}
}else if(stage === "testing"){
    envConfig = require("./testing").default
}else if(stage === "local"){
    envConfig = {port: 4001}
}


module.exports = merge({
    stage,
    env: process.env.NODE_ENV,
    port: 4001,
    secrets:{
        user: process.env.USER_SECRET,
        admin: process.env.ADMIN_SECRET,
        mongo_uri: process.env.MONGO_URI
    }
    
}, envConfig); 