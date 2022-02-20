const productService = require("../services/housing");


module.exports = () => {
    return (req, res, next) => {
        req.storage = {
            getAll: productService.getAll,
            getById: productService.getById,
            edit: productService.edit,
            del: productService.del,
            create: productService.create,
            rent: productService.rent,
            searchByType: productService.searchByType
        };
        next();
  };
};