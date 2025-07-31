
const mongoose = require('mongoose')



function ConnectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Connected to DB")
        
    })
    .catch((err)=>{
        console.log("Error connecting to MongoDB")
    })
}


module.exports = ConnectDB