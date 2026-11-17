import mongoose from 'mongoose';

// Connects to MongoDB using the URI from the .env file.
// Throws an error if the connection fails; server.js decides what to do.
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Check your .env file.');
  }

  // Without this, a bad connection would hang for 30 seconds before failing.
  // 5 seconds is enough to know something is wrong.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}