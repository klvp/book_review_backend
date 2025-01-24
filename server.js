const express = require("express")
const cors = require("cors")
require("dotenv").config()
const ApiRoutes = require("./routes")

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Allow credentials (cookies, etc.)
}))

let PORT = process.env.PORT || 5000
require("./lib/db.connection")

app.get("/", async (req, res) => {
    return res.status(200).send("Hello I am node express server 🚀")
})

app.get("/healthcheck", async (req, res) => {
    try {
        let health = {
            uptime: process.uptime(),
            cpu: process.cpuUsage(),
            memory: process.memoryUsage()
        }
        return res.status(200).send({ status: true, message: 'health of the node server', data: health })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: 'something happended on server' })
    }
})

app.use("/api", ApiRoutes)

app.listen(PORT, () => console.log(`server started on port ${PORT}`))