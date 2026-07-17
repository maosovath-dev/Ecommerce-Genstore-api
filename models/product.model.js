const pool = require("../config/db");

const getAllProducts = async () => {
    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image_url,
            p.cloudinary_id,
            p.status,
            p.created_at,
            p.updated_at,

            c.id AS category_id,
            c.name AS category_name,

            ROUND(AVG(r.rate), 1) AS average_rating,
            COUNT(r.id) AS total_reviews

        FROM products p

        INNER JOIN categories c
            ON p.category_id = c.id

        LEFT JOIN ratings r
            ON p.id = r.product_id

        GROUP BY
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image_url,
            p.cloudinary_id,
            p.status,
            p.created_at,
            p.updated_at,
            c.id,
            c.name

        ORDER BY p.id ASC
        
    `);

    return rows;
};

// ORDER BY p.id DESC ចង់បានទិន្នន័យដែលតម្រៀបពី Id ធំទៅ Id តូច

const getProductById = async (id) => {
    const [rows] = await pool.query(
        `
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image_url,
            p.cloudinary_id,
            p.status,
            c.id AS category_id,
            c.name AS category_name,

            ROUND(AVG(r.rate),1) AS average_rating,
            COUNT(r.id) AS total_reviews

        FROM products p

        INNER JOIN categories c
            ON p.category_id = c.id

        LEFT JOIN ratings r
            ON p.id = r.product_id

        WHERE p.id = ?

        GROUP BY
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image_url,
            p.cloudinary_id,
            p.status,
            c.id,
            c.name
        `,
        [id],
    );

    return rows[0];
};
const normalizeStatus = (status) => {
    if (status === undefined || status === null) {
        return undefined;
    }

    if (typeof status === "boolean") {
        return status ? 1 : 0;
    }

    if (typeof status === "number") {
        return status === 1 ? 1 : 0;
    }

    const normalized = String(status).trim().toLowerCase();
    if (["active", "1", "true", "yes"].includes(normalized)) return 1;
    if (["inactive", "0", "false", "no"].includes(normalized)) return 0;

    return undefined;
};

const createProduct = async (body, image_url, cloudinary_id) => {
    const status = normalizeStatus(body.status);

    const arr = [
        body.name,
        body.category_id,
        body.description,
        body.price,
        body.stock || 0,
        status !== undefined ? status : 1,
        image_url,
        cloudinary_id,
    ];
    const [result] = await pool.query(
        `INSERT INTO products
        (name, category_id, description, price, stock, status, image_url, cloudinary_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        arr,
    );

    return result.insertId;
};

const updateProduct = async (id, body, image_url, cloudinary_id) => {
    const status = normalizeStatus(body.status);

    const arr = [
        body.name,
        body.category_id,
        body.description,
        body.price,
        body.stock || 0,
        status !== undefined ? status : 1,
        image_url,
        cloudinary_id,
        id
    ];
    const [result] = await pool.query(
        `UPDATE products
        SET name = ?, category_id = ?, description = ?, price = ?, stock = ?, status = ?, image_url = ?, cloudinary_id = ?
        WHERE id = ?`,
        arr,
    );

    return result.affectedRows > 0;
};

const deleteProduct = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM products WHERE id = ?`,
        [id],
    );

    return result.affectedRows > 0;
}

const updateProductImage = async (id, image_url, cloudinary_id) => {
    const [result] = await pool.query(
        `UPDATE products
        SET image_url = ?, cloudinary_id = ?
        WHERE id = ?`,
        [image_url, cloudinary_id, id],
    );

    return result.affectedRows > 0;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    updateProductImage
};
