const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    let extFile = path.extname(file.originalname);
    let whiteListFormat = [".png", ".jpeg", ".jpg", ".webp"];
    if (whiteListFormat.includes(extFile)) {
      cb(null, Date.now() + extFile);
    } else {
      cb(new Error(`only format .png  , ... allow upload`));
    }
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
