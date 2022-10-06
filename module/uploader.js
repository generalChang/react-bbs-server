const path = require("path");
const multer = require("multer");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (
    ext == ".png" ||
    ext == ".jpg" ||
    ext == ".jpeg" ||
    ext == ".gif" ||
    ext == ".psd" ||
    ext == ".pdd" ||
    ext == ".tif" ||
    ext == ".svg"
  ) {
    cb(null, true); //사진파일만.
  } else {
    cb({ msg: "only png, jpg, jpeg, gif allowed!!!" }, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("file");

module.exports = upload;
