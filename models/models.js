const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review', // Reference to the Reviews collection
        },
    ],
}, { timestamps: true })

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User collection
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book', // Reference to a Book collection (if you have one)
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Assuming a 5-star rating system
    },
    reviewText: {
        type: String,
        trim: true,
    }
}, { timestamps: true })

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        authors: {
            type: [String], // Array of author names
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String, // URL for the book's cover image
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5, // Assuming ratings are between 0 and 5
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review', // Reference to the reviews for the book
            },
        ],
    },
    { timestamps: true }
);
const User = mongoose.model("User", userSchema)
const Review = mongoose.model("Review", reviewSchema)
const Book = mongoose.model("Book", bookSchema)
module.exports = {
    User,
    Review,
    Book
};