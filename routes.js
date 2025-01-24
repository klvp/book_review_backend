const {
    userRegisteration,
    userLogin,
    getAllBooks,
    postReview,
    getBookDetailsWithReviewsByID,
    deleteReview,
    getUser,
    updateReview
} = require("./controller/controller")
const { auth } = require("./middleware/auth")
const router = require("express").Router()

// user endpoints
router.post("/register", userRegisteration)
router.post("/login", userLogin)

router.post("/user", auth, getUser)

// books endpoints
router.get("/books", getAllBooks)
router.get("/books/:bookID", getBookDetailsWithReviewsByID)

// reviews endpoints
router.post("/reviews", auth, postReview)
router.delete("/reviews/:reviewID", auth, deleteReview)
router.patch("/reviews/:reviewID", auth, updateReview)

module.exports = router