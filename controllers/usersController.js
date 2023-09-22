const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require("../models/user");

const registerUser = async (req = request, res = response) => {
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

module.exports = {
    registerUser
}