const pool =  require('../config/db');


const getAllCategories = async () => {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
};

const getCategoryById = async (id) => {
    // បញ្ជូន [id] ចូលទៅក្នុង query ដើម្បីសុវត្ថិភាពពី SQL Injection
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);

    return rows.length > 0 ? rows[0] : null;
};

const createCategory = async (body, imageUrl, cloudinaryId) => {
    // ត្រូវយកតម្លៃ imageUrl និង cloudinaryId ពី Parameter ផ្ទាល់ មិនមែនទាញចេញពី body ឡើយ
    const arr = [
        body.name,
        body.description,
        imageUrl,        // <--- យកតម្លៃពី Parameter ទី២
        cloudinaryId     // <--- យកតម្លៃពី Parameter ទី៣
    ];

    const [result] = await pool.query(
        `INSERT INTO categories
        (name, description, image_url, cloudinary_id)
        VALUES (?, ?, ?, ?)`, arr
    );

    return result.insertId;
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory
}