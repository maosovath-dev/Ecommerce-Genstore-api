const express = require('express');
const router = express.Router();

const handleUploadImage = require('../middlewares/handleImageUpload');
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.getAllCategory);
router.get('/:id', categoryController.getCategoryById );
router.post('/', handleUploadImage, categoryController.createCategory);


module.exports = router;