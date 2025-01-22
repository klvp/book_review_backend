const { userRegisteration, userLogin, getAllBooks, postReview, getBookDetailsWithReviewsByID, deleteReview } = require("./controller/controller")
const { auth } = require("./middleware/auth")

const router = require("express").Router()

// user endpoints
router.post("/register", userRegisteration)
router.post("/login", userLogin)

// books endpoints
router.get("/books", auth, getAllBooks)
router.get("/books/:bookID", auth, getBookDetailsWithReviewsByID)

// reviews endpoints
router.post("/reviews", auth, postReview)
router.delete("/reviews/:reviewID", auth, deleteReview)

module.exports = router