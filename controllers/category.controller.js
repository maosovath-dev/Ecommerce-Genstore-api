const categoryService = require("../services/category.service");
const { sendResponse } = require("../utils/responseHelper");

const getAllCategory = async (req, res) => {
    try {
        const category = await categoryService.getAllCategories();
        sendResponse(res, 200, true, "categoty retrieved successfully", category);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryService.getCategoryById(categoryId);
        if (!category) {
            return sendResponse(res, 404, false, 'category not found');
        }
        sendResponse(res, 200, true, 'Category retrieved successfully', category);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}

const createCategory = async (req, res) =>{
    try{
        const body = req.body;
        const file = req.file;

        const resultCreate = await categoryService.createCategory(body, file);

        return sendResponse(res, 201, true, 'Category created successfully', resultCreate);


    }catch(error){
        sendResponse(res, 500, false, error.message);
    }
}

module.exports = {
    getAllCategory,
    getCategoryById,
    createCategory
}
