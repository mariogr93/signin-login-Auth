require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateRandomToken() {
    require("crypto").randomBytes(64, function (err, buffer) {
        var token = buffer.toString("hex");
        console.log(token);
    });
    console.log(require("crypto").randomBytes(64).toString("hex"));
}

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(402).send("Unauthorized request");
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log(token, "----------TOKEN----------")
    if (token === "null") {
        return res.status(402).send("Unauthorized request");
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(payload,"----------payload----------" )
        req.userTokenId = payload._id;
        next();
        return;
    } catch (error) {
        console.log(error);
        return res
            .status(402)
            .send(
                JSON.stringify({
                    ERROR: error,
                    response: "Unauthorized request",
                    function: "verifyToken",
                })
            );
    }
}

module.exports = {
    generateRandomToken,
    verifyToken,
};
