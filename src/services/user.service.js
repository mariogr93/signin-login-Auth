const config = require("../../config");

const { Pool } = require("pg");

const pool = new Pool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    port: config.DBPORT,
});

async function getAllUsers() {
    try {
        const response = await pool.query("SELECT * FROM users");
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getUserById(id) {
    try {
        const response = await pool.query(
            `SELECT * FROM users
        WHERE id = $1`,
            [id]
        );

        return response;
    } catch (error) {
        console.log(error);
    }
}

async function getUserByEmail(email) {
    try {
        const response = await pool.query(
            `SELECT * FROM users
          WHERE email = $1`,
            [email]
        );

        return response;
    } catch (error) {
        console.log(error);
    }
}

async function createUser(newUserObj) {
    try {
        const { username, email, hashedPassword } = newUserObj;

        const response = await pool.query(
            `INSERT INTO users 
        (username, email, user_password) 
        VALUES ($1,$2,$3)`,
            [username, email, hashedPassword]
        );

        return response;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
};
