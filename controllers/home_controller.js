import File from '../models/file.js';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const FILES_PATH = path.join("/uploads/csv");

// Export home
export default class homeController{
    async home  (req, res) {
        try {
            const files = await File.find({}).sort('-createdAt');
            return res.render('home', {
                title: 'CSV Upload',
                files: files,
            });
        } catch (error) {
            console.log('Error', error);
        }
    };
    
    // Update user details
     async uploadFile (req, res) {
        try {
            File.uploadedCSV(req, res, async (err) => {
                if (err) { console.log('******Multer Error: ', err); }
    
                if (
                    (req.file && req.file.mimetype == "application/vnd.ms-excel") ||
                    (req.file && req.file.mimetype == "text/csv")
                ) {
                    let file = await File.create({
                        filePath: req.file.path,
                        file: req.file.filename,
                        originalName: req.file.originalname
                    });
    
                    if (err) {
                        console.log(err);
                        return res.status(400).json({
                            message: 'Error in creating Note or Uploading File',
                        });
                    }
                    console.log("file Uploaded")
                    return res.redirect('back');
                } else {
                    console.log("Please Upload CSV Format file");
                    return res.redirect("back");
                }
            });
        } catch (error) {
            console.log('cant update', error);
            return res.redirect('back');
        }
    };
    
    // Show file
     async showFile  (req, res)  {
        try {
            const filePath = await File.findById(req.query.file_id);
            const results = [];
            const header = [];
    
            fs.createReadStream(filePath.filePath)
                .pipe(csv())
                .on("headers", (Headers) => {
                    Headers.map((head) => {
                        header.push(head);
                    });
                    console.log("header => ", header);
                })
                .on("data", (data) => results.push(data))
                .on("end", () => {
                    let page = req.query.page;
                    let startSlice = (page - 1) * 100 + 1;
                    let endSlice = page * 100;
                    let SliceResults = [];
                    let totalPages = Math.ceil(results.length / 100);
    
                    if (endSlice < results.length) {
                        SliceResults = results.slice(startSlice, endSlice + 1);
                    } else {
                        SliceResults = results.slice(startSlice);
                    }
    
                    return res.render('file', {
                        title: filePath.originalName,
                        head: header,
                        data: SliceResults,
                        length: results.length,
                        page: req.query.page,
                        totalPages: totalPages,
                        file: filePath
                    });
                });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
               message: "Internal Server Error",
            });
        }
    };
    
    // Delete files
     async deleteFile (req, res) {
        try {
            const fileName = req.params.id;
            const isFile = await File.findOne({file: fileName});
    
            if(isFile){
                fs.unlinkSync(isFile.filePath);
                await File.deleteOne({file: fileName});
                console.log('File is deleted');
                return res.redirect('back');
            } else {
                console.log('File not found');
                return res.redirect('back');
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
               message: "Internal Server Error",
            });
        }
    };
    
}
