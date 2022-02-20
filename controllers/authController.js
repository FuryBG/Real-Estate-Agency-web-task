const router = require("express").Router();
const { isGuest, isUser } = require("../middlewares/guards");

    router.get("/register", isGuest(), (req, res) => {
        res.render("register.hbs");
    });

    router.post("/register", isGuest(), async(req, res) => {
        try{
            let errors = [];
            let nameRegex = /[A-Za-z]+ [A-Za-z]+/g;
            if(!req.body.name.match(nameRegex)) {
                errors.push("Name is not valid!");
            };
            if(req.body.username.length < 5) {
                errors.push("Username is too short!");
            };
            if(req.body.password.length < 4) {
                errors.push("Password is too short!");
            };
            if(req.body.password != req.body.rePass) {
                errors.push("Passwords must match!");
            };
            if(errors.length > 0) {
                throw new Error(errors.join("\n"));
            };
            await req.auth.register(req.body.username, req.body.password);
        res.redirect("/");
        }catch(err) {
            console.log(err);
            res.render("register.hbs", {errors: err.message.split("\n"), info: req.body.name});
        }
    });

    router.get("/login", isGuest(), (req, res) => {
        res.render("login.hbs");
    });

    router.post("/login", isGuest(), async(req, res) => {
        try{
            await req.auth.login(req.body.username, req.body.password);
        res.redirect("/");
        }catch(err) {
            console.log(err);
            res.render("login.hbs", {errors: err.message.split("\n")});
        }
    });


    router.get("/logout", isUser(), (req, res) => {
        req.auth.logout();
        res.redirect("/");
    });


module.exports = router;