const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params: {
        folder : process.env.FOLDER_NAME,
        allowedFormats :  ["png", "jpg", "jpeg"],       
        public_id: (req, file) => file.originalname, 
    },
})

module.exports = { cloudinary, storage};