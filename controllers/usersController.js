const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require("../models/user");
const { generateJWT } = require("../helpers/generateJWT");

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

const editUser = async (req = request, res = response) => {
    try {
        const { username, firstname, lastname, cellphone, profilePhoto, _id } = req.body;
        if (!_id) {
            return res.status(400).json({ message: "Username is required" });
        }

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

        const user = await User.findById(_id);
        if (!user) {
            return res.status(400).json({ message: "Id not valid or user does not exists." });
        }

        user.username = username;
        user.firstname = firstname;
        user.lastname = lastname;
        user.cellphone = cellphone;
        user.profilePhoto = profilePhoto;
        await User.updateOne({ _id }, user);
        return res.status(201).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const login = async (req, res = response) => {

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
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

        const token = await generateJWT(user.id);

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

const getUsers = async (req = request, res = response) => {
    return res.status(200).json((await User.find()));
}

module.exports = {
    registerUser,
    login,
    editUser,
    getUsers
}