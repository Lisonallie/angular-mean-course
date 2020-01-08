const multer = require("multer");


const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
  //show multer where to store things and how to store them
  const storage = multer.diskStorage({
    //destination is a function which will be executed whenever multer tries to save a file
    destination: (request, file, callback) => {
      //throw error if one of the mimetypes is not what's entered
      //shoudl return null if we get a mimetype that's not part of this map
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid file extension");
      if (isValid) {
        error = null;
      }
      //      vvv if it gets an error
      //              vv where to store images, this path is seen relative to your server.js file
      callback(error, "images");
    },
    //filename
    filename: (request, file, callback) => {
      //                          vv normalize this to get one name file, remove spaces replace by dashes
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      //                      vv get the extension matching the specified expected extensions
      //multer automatically gives us the mimetpe
      const extension = MIME_TYPE_MAP[file.mimetype];
      //                         vvv current timestamp
      callback(null, name + "-" + Date.now() + "." + extension);
    }
  });

  module.exports = multer({ storage: storage }).single("image");