const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);


// Connecting database
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI);
        console.log("MongoDb connected successfully!");
    } catch(error) {
        console.log("Error while connecting database", error);
    }
}


module.exports = connectDB;