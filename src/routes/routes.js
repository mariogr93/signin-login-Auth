const { Router } = require("express");
const {generateRandomToken, verifyToken} = require("../utils/utils")

const {
    getProducts,
    createProducts,
} = require("../controllers/products.controller");

const { 
    getUsers, 
    signIn, 
    login 
} = require("../controllers/users.controller");

const router = Router();

//const users = [];

//PRODUCTS

router.get("/products", (req, res) => {
    getProducts(req, res);
});

router.post("/product/register",verifyToken, (req, res) => {
    res.json(["worked"])
    //createProducts(req, res);
});

//USERS

router.get("/users", (req, res) => {
    getUsers(req, res);
});

router.post("/user/signin", async (req, res) => {
    signIn(req, res);
});

router.post("/user/login", (req, res) => {
    login(req, res);
});



module.exports = router;
