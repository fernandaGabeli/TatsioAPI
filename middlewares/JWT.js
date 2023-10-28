const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const validateJWT = async (req = request, res = response, next) => {

    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            msg: 'Auth token required'
        });
    }

    try {
        token = token.replace("Bearer ", "");
        const { uid } = jwt.verify(token, process.env.PRIVATEKEY);
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Invalid token'
            })
        }

        req.user = user;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        })
    }

}




module.exports = {
    validateJWT
}