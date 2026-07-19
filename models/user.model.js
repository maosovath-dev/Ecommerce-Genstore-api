const pool = require('../config/db');

const findByEmail = async (email) => {
    // ✅ ថែម verification_token និង verification_expires ចូលក្នុង SELECT 
    const [row] = await pool.query(
        "select id, email, phone, address, role, is_verified, password_hash, verification_token, verification_expires from users where email = ?", 
        [email]
    );

    return row;
};
const findById = async (id) => {
    const [row] = await pool.query(
        "select id, email, phone, address , role,token from users where id = ?",
        [id],
    );

    return row;
};

const create = async (body) => {
    const arr = [body.name, body.email, body.password, body.verificationToken, body.verificationExpires];
    const [result] = await pool.query(
        "insert into users (name, email, password_hash, verification_token, verification_expires) value (?,?,?,?,?)",
        arr,
    );

    return result.insertId;
};

const addToken = async (token, id) => {
    await pool.query("update users set token = ? where id = ?", [token, id]);

}

const getByToken = async (token) => {
    const [row] = await pool.query("select token from users where token = ?", [token]);

    return row;
};

const deleteToken = async (id) => {
    await pool.query("update users set token = null where id = ?", [id]);
}
const findByVerificationEmail = async (token) => {
    const [row] = await pool.query('select id, name, email, password_hash as password, phone, address, role, verification_token,verification_expires,is_verified as isVerified from users where verification_token = ?', [token]);

    return row;
}
const verifiedEmail = async (id) => {
    await pool.query('update users set is_verified = 1 where id = ?', [id]);
}
const resendVerificationLink = async (body) => {
    let arr = [
        body.verification_token,
        body.verification_expires,
    ]
    await pool.query('update users set verification_token = ?, verification_expires = ? where id = ?')
}
module.exports = {
    findByEmail,
    findById,
    create,
    addToken,
    getByToken,
    deleteToken,
    findByVerificationEmail,
    verifiedEmail,
    resendVerificationLink
};