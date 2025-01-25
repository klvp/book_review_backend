const bcrypt = require("bcrypt")
const { Book } = require("../models/models")

module.exports.genHashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

module.exports.isPasswordCorrect = async (password, hasedPassword) => {
    const authorised = await bcrypt.compare(password, hasedPassword)
    return authorised
}
module.exports.updateBookRating = async (bookID) => {
    const bookDoc = await Book.findById(bookID).populate('reviews');
    const totalRatings = bookDoc.reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRatings / bookDoc.reviews.length;
    bookDoc.rating = averageRating;
    await bookDoc.save();
}