const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('====================================');
  console.log("MONGO_DB_URL", process.env.MONGO_DB_URL);
  console.log('====================================');
  const conn = await mongoose.connect(process.env.MONGO_DB_URL);
  console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;