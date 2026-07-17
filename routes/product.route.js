const express = require('express');
const router = express.Router();

const handleUploadImage = require('../middlewares/handleImageUpload');
const productController = require('../controllers/product.controller');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', handleUploadImage, productController.createProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/:id', handleUploadImage, productController.updateProduct);
router.put('/:id/image', handleUploadImage, productController.updateProductImage);



module.exports = router;