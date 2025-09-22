import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDb from "./config/db.js"
import {inngest, functions} from "./inngest/index.js"
import {serve} from 'inngest/express'
const app = express()

app.use(express.json())
app.use(cors())
await connectDb()

app.get("/", (req, res) =>{
    res.send("server is running")
})

// thisis for ingees
app.use("/api/inngest", serve({ client: inngest, functions }))


const PORT = process.env.PORT || 4000
app.listen(PORT, (req, res) =>{
    console.log("server is running")
}) 