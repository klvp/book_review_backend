const bcrypt = require("bcrypt")

module.exports.genHashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

module.exports.isPasswordCorrect = async (password, hasedPassword) => {
    const authorised = await bcrypt.compare(password, hasedPassword)
    return authorised
}