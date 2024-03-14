import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

const FILE_PATH = path.join('uploads/csv');

// Creating user schema
const fileSchema = new mongoose.Schema({
    filePath: {
        type: String,
     },
     originalName: {
        type: String,
     },
     file: {
        type: String,
     },
},{
    timestamps: true,
});

// Settings for uploading file using Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  FILE_PATH);
    }, 
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '_' + uniqueSuffix);
    }
});

// Static methods
fileSchema.statics.uploadedCSV = multer({ storage: storage }).single('file');
fileSchema.statics.csvPath = FILE_PATH;

// Making model
const File = mongoose.model('File', fileSchema);

// Exporting model
export default File;
