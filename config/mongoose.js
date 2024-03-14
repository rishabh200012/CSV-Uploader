import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/csvfile');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error in connecting Database'));

db.once('open', () => {
    console.log("Database connected.");
});

export default db;
