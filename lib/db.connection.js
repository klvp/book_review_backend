const mongoose = require("mongoose")

const MONGO_URL = process.env.MONGO_URL

mongoose
    .connect(MONGO_URL)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("DB Connection Error", err))