const jwt = require("jsonwebtoken")
const { User, Book, Review } = require("../models/models")
const { genHashPassword, isPasswordCorrect, updateBookRating } = require("../utility/helper")

module.exports.userRegisteration = async (req, res) => {
    try {
        const { body: { name, email, password } } = req
        let user = await User.findOne({ email })
        if (user) {
            return res.status(403).send({ status: false, message: "User already exist" })
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
        res.cookie("token", token, {
            expires: new Date(Date.now() + 3000000),
        });
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
        let newReview = await Book
            .findById(bookID)
            .populate({
                path: "reviews",
                select: { rating: 1, reviewText: 1, user: 1, createdAt: 1 },
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "user",
                    select: { name: 1 }
                }
            })
        return res.status(200).send({ message: "book reviews", data: newReview })
    } catch (error) {
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.postReview = async (req, res) => {
    try {
        const { body: { book, rating, reviewText = "" } = {} } = req
        let reviewExist = await Review.findOne({ user: req.user._id, book })
        if (reviewExist?._id) {
            await Review.findByIdAndUpdate(
                reviewExist._id,
                {
                    $set: { rating, reviewText }
                }
            )
            await updateBookRating(reviewExist.book)
            return res.status(200).send({ message: "user book review exist" })
        }
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

        await updateBookRating(book)


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

        await updateBookRating(review.book)

        return res.status(200).send({ message: "review deleted", data: deletedReview })
    } catch (error) {
        console.log("🚀 ~ module.exports.deleteReview ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.updateReview = async (req, res) => {
    try {
        const {
            params: { reviewID } = {},
            body: { rating, reviewText = "" } = {},
        } = req
        let review = await Review.findById(reviewID)
        if (!review) return res.status(404).send({ message: "comment not found" })
        await Review.findByIdAndUpdate(
            reviewID,
            {
                $set: { rating, reviewText }
            }
        )
        await updateBookRating(review.book)
        return res.status(200).send({ message: "review updated" })
    } catch (error) {
        console.log("🚀 ~ module.exports.updateReview= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.getUser = async (req, res) => {
    try {
        if (!req.user._id) return res.status(401).send({ message: "user not authorised", data: {} })
        let user = await User.findById(req.user._id).populate({
            path: "reviews",
            select: { rating: 1, reviewText: 1, user: 1, createdAt: 1, book: 1 },
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "book",
                select: { title: 1, image: 1 }
            }
        })
        if (!user) return res.status(404).send({ message: "user not found", data: {} })
        return res.status(200).send({ message: "user fetched", data: user })
    } catch (error) {
        console.log("🚀 ~ module.exports.getUser= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }

}