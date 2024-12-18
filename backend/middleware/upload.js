// /middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Само изображения са позволени'), false);
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;