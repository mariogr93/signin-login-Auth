require("dotenv").config();
const {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
} = require("../services/user.service");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getUsers(req, res) {
    try {
        const response = await getAllUsers();
        

        if (response && response.rows.length > 0) {
            res.status(200);
            res.send(
                JSON.stringify({
                    response: response.rows,
                    userCount: response.rows.length,
                })
            );
        } else {
            res.status(204);
            res.send(
                JSON.stringify({ response: "No users found", userCount: 0 })
            );
        }
    } catch (error) {
        console.log("FALLO!");
        res.status(500);
        res.send(JSON.stringify({ ERROR: error, function: "getUsers" }));
        console.log(error);
    }
}

async function signIn(req, res) {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const checkUserAlreadyRegistered = await getUserByEmail(email);
        if (
            checkUserAlreadyRegistered &&
            checkUserAlreadyRegistered.rows.length == 0
        ) {
            const newUserObj = { username, email, hashedPassword };
            registerNewUser(req,res, newUserObj);
        } else {
            res.status(400);
            res.send(JSON.stringify({ response: "Email already registered" }));
        }
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ ERROR: error, function: "signIn" }));
    }
}

async function registerNewUser(req,res, newUserObj) {
    try {
        const response = await createUser(newUserObj);
        if (response.rowCount == 1) {
            login(req, res)
        } else {
            res.status(400);
            res.send(JSON.stringify({ response: "something went wrong" }));
        }
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ ERROR: error, function: "registerNewUser" }));
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const userRegistered = await getUserByEmail(email);

        if (userRegistered && userRegistered.rows.length > 0) {
            
            try {
                
                if (
                    await bcrypt.compare(password, userRegistered.rows[0].user_password)
                ) {
                    
                    const payload = {
                        id: userRegistered.rows[0].id,
                        email: userRegistered.rows[0].email,
                        password: userRegistered.rows[0].user_password,
                    };

                    const accessToken = jwt.sign(
                        payload,
                        process.env.ACCESS_TOKEN_SECRET
                    );

                    res.status(200);
                    res.send(
                        JSON.stringify({
                            token: "Bearer " + accessToken,
                            userInfo: userRegistered.rows[0],
                            success: true,
                        })
                    );
                } else {
                    res.send(JSON.stringify({  ERROR: error,response: "not allowed" }));
                }
            } catch (error) {
                res.status(404);
                res.send(JSON.stringify({  ERROR: error,esponse: "Incorrect password" }));
            }
        } else {
            res.status(404);
            res.send(JSON.stringify({  ERROR: error,response: "Email not found" }));
        }
    } catch (error) {
        res.status(500);
        res.send(JSON.stringify({ ERROR: error, function: "signIn" }));
    }
}

module.exports = {
    getUsers,
    signIn,
    login,
};
