// extract image ,mp3 file from front end / API and provide its path

import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

const upload = multer({ storage });

export default upload;