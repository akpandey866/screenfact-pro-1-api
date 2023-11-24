// middlewares/fileUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to dynamically set the destination folder
const getDestinationFolder = (req, file, cb) => {
  try {
    const folder = req.body.fileType || 'default';
    const destinationFolder = path.join('uploads', folder);

    // Check if destinationFolder exists, create it if not
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    cb(null, destinationFolder);
  } catch (error) {
    cb(error);
  }
};

// Configure multer storage to use the dynamic destination folder function
const storage = multer.diskStorage({
  destination: getDestinationFolder,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // File name (timestamp + original name)
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB limit
  },
});

module.exports = { upload, getDestinationFolder };
