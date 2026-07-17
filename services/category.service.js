const categoryModel = require('../models/category.model');

const getAllCategories = async () => {
    const categories = await categoryModel.getAllCategories();

    return categories;
};

const getCategoryById = async (id) => {
    const category = categoryModel.getCategoryById(id);

    return category;

}

const createCategory = async (body, file) => {
    console.log("DEBUG FILE OBJECT:", file);
    let imageUrl = null;
    let cloudinaryId = null;

    if (file) {
        imageUrl = file.path;
        cloudinaryId = file.filename;
    }

    const insertedId = await categoryModel.createCategory(body, imageUrl, cloudinaryId);
    const getById = await categoryModel.getCategoryById(insertedId);
    return getById;

}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory
}
