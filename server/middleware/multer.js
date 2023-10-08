const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Get content type and unique identifier from the request
        const { contentType, id } = req.query;
        console.log('contentType', contentType);
        console.log('id', id);

        if (contentType && id) {
            // Define the base directory
            let baseDir = path.join(__dirname, '../storage');
            // Append the content type to the base directory
            baseDir = path.join(baseDir, contentType, id);
            // Create the directory if it doesn't exist
            if (!fs.existsSync(baseDir)) {
                fs.mkdirSync(baseDir, { recursive: true });
            }
            cb(null, baseDir);
        } else {
            cb('Error: Missing required parameters', null);
        }
    },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

const upload = multer({ storage: storage });
console.log('upload', upload);

module.exports = upload;