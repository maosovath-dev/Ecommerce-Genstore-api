const productModel = require('../models/product.model');

const getAllProducts = async () => {
    const products = await productModel.getAllProducts();
    return products;
};

const getProductById = async (id) => {
    const product = await productModel.getProductById(id);
    return product;
};

const createProduct = async (body, file) => {
    let imageUrl = null;
    let cloudinaryId = null;

    if(file) {
        imageUrl = file.path;
        cloudinaryId = file.filename;
    }

    const insertedId = await productModel.createProduct(body, imageUrl, cloudinaryId);
    const getById = await productModel.getProductById(insertedId);
    return getById;
};

const updateProduct = async (id, body, file) => {
    let imageUrl = null;
    let cloudinaryId = null;

    if(file) {
        imageUrl = file.path;
        cloudinaryId = file.filename;
    }

    const updated = await productModel.updateProduct(id, body, imageUrl, cloudinaryId);
    if (!updated) {
        return null;
    }
    const getById = await productModel.getProductById(id);
    return getById;
};

const deleteProduct = async (id) => {
    const deleted = await productModel.deleteProduct(id);
    return deleted;
}

const updateProductImage = async (id, file) => {
    if (!file) {
        return null;
    }

    const imageUrl = file.path;
    const cloudinaryId = file.filename;
    
    const updated = await productModel.updateProductImage(id, imageUrl, cloudinaryId);
    if (!updated) {
        return null;
    }
    const getById = await productModel.getProductById(id);
    return getById;
}


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductImage
};

