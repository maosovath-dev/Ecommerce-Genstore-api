const productService = require('../services/product.service');
const { sendResponse } = require('../utils/responseHelper');

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        sendResponse(res, 200, true, 'Products retrieved successfully', products);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        if (!product) {
            return sendResponse(res, 404, false, 'Product not found');
        }
        sendResponse(res, 200, true, 'Product retrieved successfully', product);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

const createProduct = async (req, res) => {
    try {
        const body = req.body;
        const file = req.file;

        const result = await productService.createProduct(body, file);

        return sendResponse(res, 201, true, 'Product created successfully', result);


    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const body = req.body;
        const file = req.file;

        const result = await productService.updateProduct(productId, body, file);

        if (!result) {
            return sendResponse(res, 404, false, 'Product not found');
        }

        return sendResponse(res, 200, true, 'Product updated successfully', result);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deleted = await productService.deleteProduct(productId);
        if (!deleted) {
            return sendResponse(res, 404, false, 'Product not found!');
        }
        sendResponse(res, 200, true, 'Product deleted successfully');
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

const updateProductImage = async (req, res) => {
    try {
        const productId = req.params.id;
        const file = req.file;

        const result = await productService.updateProductImage(productId, file);

        if (!result) {
            return sendResponse(res, 404, false, 'Product not found or no image provided');
        }

        return sendResponse(res, 200, true, 'Product image updated successfully', result);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    updateProductImage
};

