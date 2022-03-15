const { Pool } = require("pg");
const config = require("../../config");

const pool = new Pool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    port: config.DBPORT,
});

async function getProducts(req, res) {
    const response = await pool.query("SELECT * FROM products");

    res.send(JSON.stringify({ response: response.rows }));
}

async function createProducts(req, res) {
    var brand = req.body.brand;
    var productName = req.body.productName;
    var description = "req.body.description";
    var category = req.body.category;
    //var  subCategory,
    var purchasePrice = req.body.purchasePrice * 1;
    var sellPrice = req.body.sellPrice * 1;

    // purchasePrice = purchasePrice * 1;
    // sellPrice = sellPrice * 1;
    pool.query(
        "INSERT INTO products (brand,product_name,category ,product_description,price_of_purchase ,price_of_sell) VALUES ($1,$2,$3,$4,$5,$6)",
        [
            brand,
            productName,
            category,
            description,
            // subCategory,
            purchasePrice,
            sellPrice,
        ]
    );

    res.send(JSON.stringify({ response: "llego la peticion" }));
}

module.exports = {
    getProducts,
    createProducts,
};
