const express = require("express");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const sessionParser = require("express-session");
const authMiddleware = require("../middlewares/auth");
const productMiddleware = require("../middlewares/product");

module.exports = (app) => {
    app.engine("hbs", hbs.engine({
        extname: "hbs"
    }));
    app.use("/static", express.static("static"));
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(sessionParser({
        secret: "secret",
        resave: false,
        cookie: {
            secure: "auto"
        }
    }));
    app.use(authMiddleware());
    app.use(productMiddleware());
};