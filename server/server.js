import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDb from "./config/db.js"
import {inngest, functions} from "./inngest/index.js"
import {serve} from 'inngest/express'
import { clerkMiddleware , clerkClient, requireAuth, getAuth } from '@clerk/express'
import userRouter from "./routes/userRoutes.js"


const app = express()
await connectDb()


app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


app.get("/", (req, res) =>{
    res.send("server is running")
})

// thisis for ingees
app.use("/api/inngest", serve({ client: inngest, functions }))
// user router
app.use("/api/user", userRouter)



app.get("/debug", async (req, res) => {
  console.log("typeof req.auth:", typeof req.auth);
  console.log("req.auth value:", req.auth);
  if (typeof req.auth === "function") {
    console.log("req.auth():", await req.auth());
  }
  console.log("getAuth(req):", getAuth(req));
  console.log("Authorization header:", req.headers.authorization);

  res.json({ message: "Check your server logs" });
});


const PORT = process.env.PORT || 4000
app.listen(PORT, (req, res) =>{
    console.log("server is running")
}) 