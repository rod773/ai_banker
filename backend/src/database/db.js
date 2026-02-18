const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI != null) {
    const mongoURI = process.env.MONGO_URI;

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    }
  } catch (error) {
    throw new Error('Failed to connect to MongoDB: ' + error.message);
  }
};

module.exports = connectDB;