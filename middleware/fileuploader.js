const multer = require("multer");
const Maincategory = require("../models/Maincategory");

function createUploader(folder) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/uploads/${folder}`);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

  return multer({ storage: storage });
}

module.exports = {
  maincategoryUploader: createUploader("maincategory"),
  subcategoryUploader: createUploader("subcategory"),
  brandUploader: createUploader("brand"),
  testimonialUploader: createUploader("testimonial"),
  productUploader: createUploader("product"),
  userUploader: createUploader("user"),
};
