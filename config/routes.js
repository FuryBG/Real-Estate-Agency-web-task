const authController = require("../controllers/authController");
const productController = require("../controllers/productsController");


module.exports = (app) => {
    app.use("/auth", authController);
    app.use("/", productController);
};