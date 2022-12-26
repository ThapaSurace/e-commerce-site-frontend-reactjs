const multer = require("multer");
const fs = require("fs"); // to read folder
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let fileDestination = "public/uploads/";
    // check if directory exist
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(
        fileDestination,
        { recursive: true } // makes parent folder as well as child folder
      );
      cb(null, fileDestination);
    } else {
      cb(null, fileDestination);
    }
  },
  // setting our file name with original file name plus unique date id and extension
  // to uniquely indentify our file
  filename: (req, file, cb) => {
    let filename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    // abc.jpg
    // path.extname = jpg
    // path.basename(abc.jpg,.jpg)
    // filename = abc ... it gives name only

    let ext = path.extname(file.originalname); // gives .jpg

    cb(null, filename + "_" + Date.now() + ext);
  },
});

let imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|svg|jfif|gif|JPG|JPEG|PNG|SVG|JFIF|GIF)$/)
  ) {
    return cb(new Error("You can upload image file only"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,   // path where we want to store uploded file
  fileFilter: imageFilter,  // aceept ony list file extension like jpg.jpeg etc.
  limits: {
    fileSize: 2000000, //2MB
  },
});

module.exports = upload;
