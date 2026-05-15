import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const db = mongoose.connection;

    db.on('error', (err) => {
      console.log(`database connection error: ${err}`);
    });

    db.on('disconnected', () => {
      console.log('database disconnected');
    });

    db.once('open', () => {
      console.log(`database connected to ${db.name} on ${db.host}`);
    });

  } catch (err) {
    console.log('Mongo connection failed:', err);
  }
};