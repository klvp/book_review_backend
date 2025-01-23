const jwt = require("jsonwebtoken")
const { User, Book, Review } = require("../models/models")
const { genHashPassword, isPasswordCorrect } = require("../utility/helper")

module.exports.userRegisteration = async (req, res) => {
    try {
        const { body: { name, email, password } } = req
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).send({ status: false, message: "User already exist" })
        }
        const newUser = new User({
            name,
            email,
            password: await genHashPassword(password)
        })
        const result = await newUser.save()
        return res.status(200).send({ message: "user registered", data: result._id })

    } catch (error) {
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.userLogin = async (req, res) => {
    try {
        const { body: { email, password } } = req
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send({ status: false, message: "invalid password or email" })
        }
        if (! await isPasswordCorrect(password, user.password)) {
            return res.status(400).send({ status: false, message: "invalid password or email" })
        }
        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET_TOKEN
        )
        res.cookie("token", token, { expires: new Date(Date.now() + 86400000) });
        return res.status(200).send({ token, data: user })

    } catch (error) {
        console.log("🚀 ~ module.exports.userLogin= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.getAllBooks = async (req, res) => {
    try {
        let allBooks = await Book.find()
        if (!allBooks.length) {
            return res.status(404).send({ status: "success", data: [] })
        }
        return res.status(200).send({ status: "success", data: allBooks })

    } catch (error) {
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.getBookByID = async (req, res) => {
    try {
        const { params: { id } = {} } = req
        let bookDetails = await Book.findById(id).populate("reviews")
        if (!Object.keys(bookDetails).length) {
            return res.status(404).send({ status: "success", data: {} })
        }
        return res.status(200).send({ status: "success", data: bookDetails })

    } catch (error) {
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.getBookDetailsWithReviewsByID = async (req, res) => {
    try {
        const { params: { bookID } = {} } = req
        let newReview = await Book.findById(bookID).populate("reviews", { rating: 1, reviewText: 1, _id: 0, user: 1 })
        return res.status(200).send({ message: "book reviews", data: newReview })
    } catch (error) {
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.postReview = async (req, res) => {
    try {
        const { body: { book, rating, reviewText = "" } = {} } = req
        let review = new Review(
            { user: req.user._id, book, rating, reviewText }
        )
        let newReview = await review.save()
        await Book.findByIdAndUpdate(
            book,
            { $push: { reviews: newReview._id } },
            { new: true }
        );
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { reviews: newReview._id } },
            { new: true }
        );
        return res.status(201).send({ message: "posted review", data: newReview })
    } catch (error) {
        console.log("🚀 ~ module.exports.postReviews= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.deleteReview = async (req, res) => {
    try {
        const { params: { reviewID } = {} } = req
        let review = await Review.findById(reviewID)
        await Book.findByIdAndUpdate(
            review.book,
            {
                $pull: { reviews: reviewID }
            }
        )
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { reviews: reviewID } }
        )
        let deletedReview = await Review.deleteOne({ _id: reviewID })

        return res.status(200).send({ message: "review deleted", data: deletedReview })
    } catch (error) {
        console.log("🚀 ~ module.exports.deleteReview ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}