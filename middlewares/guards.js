function isUser() {
    return (req, res, next) => {
        if(req.session.user) {
            next();
        }else {
            res.redirect("/auth/login");
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if(!req.session.user) {
            next();
        }else {
            res.redirect("/");
        }
    };
}

module.exports = {
    isUser,
    isGuest
};