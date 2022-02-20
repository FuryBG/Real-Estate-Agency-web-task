const router = require("express").Router();
const { isUser } = require("../middlewares/guards");


router.get("/", async(req, res) => {
    let allItems = await req.storage.getAll();
    allItems = allItems.reverse().slice(0, 3);
    res.render("home.hbs", {allItems});
});

router.get("/search", isUser(), async(req, res) => {
    const allItems = await req.storage.getAll();
    res.render("search.hbs", {allItems});
});

router.post("/search", isUser(), async(req, res) => {
    let allItems = await req.storage.searchByType(req.body.type);
    res.render("search.hbs", {allItems});
});

router.get("/delete/:id", async(req, res) => {
    await req.storage.del(req.params.id);
    res.redirect("/all");
});

router.get("/edit/:id", async(req, res) => {
    let currItem = await req.storage.getById(req.params.id);
    res.render("edit.hbs", {currItem});
});

router.post("/edit/:id", async(req, res) => {
    try {
        let errors = [];
        if(req.body.name.length < 6) {
            errors.push("Name must to be atleast 6 characters!");
        };
        if(req.body.year < 1850 || req.body.year > 2021) {
            errors.push("Year must be between 1850 and 2021");
        };
        if(req.body.city.length < 4) {
            errors.push("City must be atleast 4 characters!");
        };
        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
        errors.push("Invalid imgage URL!");
        };
        if(req.body.description.length > 60) {
            errors.push("Description is too long! 60 characters max!");
        };
        if(req.body.pieces < 0 || req.body.pieces > 10) {
            errors.push("Pieces must be between 0 and 10!");
        };
        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        };

        await req.storage.edit(req.params.id, req.body);
        res.redirect(`/details/${req.params.id}`);
    }catch(err) {
        res.render("edit.hbs", {errors: err.message.split("\n"), currItem: req.body});
    };
});

router.get("/all", async(req, res) => {
    const allItems = await req.storage.getAll();
    res.render("aprt-for-recent.hbs", {allItems});
});

router.get("/rent/:id", async(req, res) => {
    await req.storage.rent(req.params.id, req.user._id);
    res.redirect(`/details/${req.params.id}`);
});

router.get("/details/:id", async(req, res) => {
    let currItem = await req.storage.getById(req.params.id);
    let isRent = currItem.rentUsers.find(x => x._id == req.user._id);
    let allRentUsers = currItem.rentUsers.map(x => x.username);

    if(allRentUsers.length > 0) {
        currItem.allRentUsers = allRentUsers.join(", ");
    };
    if(currItem.owner._id == req.user._id) {
        currItem.isOwner = true;
    }
    if(currItem.pieces > 0) {
        currItem.availablePieces = true;
    }
    if(isRent) {
        currItem.isRent = true;
    }

    res.render("details.hbs", currItem);
});

router.get("/create", (req, res) => {
    res.render("create.hbs");
});

router.post("/create", async(req, res) => {
    try {
        let errors = [];
        if(req.body.name.length < 6) {
            errors.push("Name must to be atleast 6 characters!");
        };
        if(req.body.year < 1850 || req.body.year > 2021) {
            errors.push("Year must be between 1850 and 2021");
        };
        if(req.body.city.length < 4) {
            errors.push("City must be atleast 4 characters!");
        };
        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
        errors.push("Invalid imgage URL!");
        };
        if(req.body.description.length > 60) {
            errors.push("Description is too long! 60 characters max!");
        };
        if(req.body.pieces < 0 || req.body.pieces > 10) {
            errors.push("Pieces must be between 0 and 10!");
        };
        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        };
        
        req.body.owner = req.user._id;
        await req.storage.create(req.body);
        res.redirect("/");
    }catch(err) {
        res.render("create.hbs", {errors: err.message.split("\n")});
    };
});

router.all("*", (req, res) => {
    res.render("404.hbs");
});




module.exports = router;