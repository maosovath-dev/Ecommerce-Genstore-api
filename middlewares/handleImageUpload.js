const multer = require('multer');

const uploadImage = require('./uploadImage');

const handleImageUpload = (req, res, next) =>{
    const upload = uploadImage.single('image');

    upload(req, res, (err) => {
        if(err instanceof multer.MulterError){
            if(err.code === 'LIMIT_FILE_SIZE'){
                return res.status(400).json({
                    result: false,
                    message: "Image is too large. Maximum size is 2MB."
                });
            }
            return res.status(400).json({
                result: false,
                message: err.message
            });
        }else if(err){
            console.error(err);

            return res.status(500).json({
                result: false,
                message: "There is a problem uploading the image. Please try again later."
            })
        }
        next();
    });
};

module.exports = handleImageUpload;