const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require("../models/user");

const registerUser = async(req = request, res = response) => {
    const { username, firstname, lastname, cellphone, password, profilePhoto } = req.body;
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    if (!firstname) {
        return res.status(400).json({ message: "Firstname is required" });
    }

    if (!lastname) {
        return res.status(400).json({ message: "Lastname is required" });
    }

    if (!cellphone) {
        return res.status(400).json({ message: "Cellphone is required" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const isPasswordValid = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character" });
    }

    const salt = bcryptjs.genSaltSync();
    const newUser = new User({
        username,
        firstname,
        lastname,
        cellphone,
        profilePhoto,
        password: bcryptjs.hashSync(password, salt)
    });
    const savedUser = await User.create(newUser);
    delete savedUser.password;
    return res.status(201).json(savedUser);
};

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'user / Password invalid'
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                message: 'user / Password invalid'
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                message: 'user / Password invalid'
            });
        }

        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error, communicate with administrator'
        });
    }

}

module.exports = {
    registerUser,
    login
}