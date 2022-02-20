const User = require("../models/User");

async function createUser(username, hashedPassword) {
    const newUser = new User({
        username,
        hashedPassword
    });
    await newUser.save();
    return newUser;
};

async function getUserByUsername(username) {
    let userRegEx = new RegExp(`^${username}$`, "i");
    const currUser = await User.findOne({username:{$regex: userRegEx}});
    return currUser;
};

module.exports = {
    createUser,
    getUserByUsername
};