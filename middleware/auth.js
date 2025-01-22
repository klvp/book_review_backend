const jwt = require("jsonwebtoken")

module.exports.auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        next();
    } catch (error) {
        res.send({ error: error });
    }
}