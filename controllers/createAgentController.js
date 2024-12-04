//import pdfParse from "pdf-parse";
import admin from "firebase-admin";
import multer from "multer";
//import { chromium } from "playwright";
const db = admin.firestore();

//handle uploading of files and save them to the cloud 
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /pdf/;
    const extname = allowedFileTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
});

const createAgent = async (req, res) => {
  try{
    const {link, text} = req.body;
    let extractedContent = "";
   
   // of the is request sent a text instead 
   if(text){
     extractedContent = text;
   }
    
    //Handling Links of the request incase Incase the request sends a link instead 
 //   if (link) {
//      const browser = await chromium.launch({ headless: true }); 
//      const page = await browser.newPage();
//      await page.goto(link); 
//      extractedContent = await page.textContent("body"); 
//      await browser.close(); 
  //  }
    
    // Handle file Extraction 
    //if(req.file){
 //     const pdfData = pdfParse(req.file.buffer);      extractedContent = pdfData.text;
   // }
    
      // Save extracted text to Firestore
    if (extractedContent) {
      const docRef = await db.collection('trainingData').add({
        extractedContent,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      return res.json({ message: 'Data successfully uploaded!', docId: docRef.id });
    }

    res.status(400).json({ message: 'No valid input provided (text, link, or file)' });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

export {upload, createAgent};
