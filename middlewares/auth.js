const userService = require("../services/user");
const bcrypt = require("bcrypt");
const { TOKEN_SECRET, COOKIE_NAME } = require("../config");

module.exports = () => (req, res, next) => {
    parseToken();
        req.auth = {
            register,
            login,
            logout
        }
        next();


    async function register(username, password) {

        const existing = await userService.getUserByUsername(username);
    
        if(existing) {
            console.log("Username is taken!");
            throw new Error("Username is taken!");
        };
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userService.createUser(username, hashedPassword);
        
        req.session.user = generateToken(user);
    };
    
    async function login(username, password) {
        const existing = await userService.getUserByUsername(username);
    
        if(!existing) {
            console.log("No such user!");
            throw new Error("Username or password is wrong!");
        }
    
        const isMatch = await bcrypt.compare(password, existing.hashedPassword);
    
        if(!isMatch) {
            console.log("Incorrect password!");
            throw new Error("Username or password is wrong!");
        }

        req.session.user = generateToken(existing);
    };

    function logout() {
        delete req.session.user;
    };





    function generateToken(userData) {
        const token = {
            _id: userData._id,
            email: userData.email
        };
        return token;
    };
    
    function parseToken() {
        if(req.session.user) {
            res.locals.user = req.session.user
        };
    };

};










