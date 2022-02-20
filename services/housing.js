const Housing = require("../models/Housing");


async function create(data) {
    const newItem = new Housing(data);
    await newItem.save();
};

async function getAll() {
    const allItems = await Housing.find({}).lean();
    return allItems;
};

async function getById(id) {
    const currItem = await Housing.findById(id).populate("rentUsers").lean();
    return currItem;
};

async function edit(id, data) {
    let currItem = await Housing.findById(id);
    let updated = Object.assign(currItem, data);
    await updated.save();
};

async function del(id) {
    await Housing.findByIdAndRemove(id);
};

async function rent(id, userId) {
    let current = await Housing.findById(id);
    current.rentUsers.push(userId);
    await current.save();
};

async function searchByType(type) {
    let allItems = await Housing.find({type: {$regex: type, $options: "i"}}).lean();
    return allItems;
};



module.exports = {
    create,
    getAll,
    getById,
    edit,
    del,
    rent,
    searchByType
};