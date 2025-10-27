import cors from "cors"
import express from "express"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import morgan from "morgan"

import { countriesStatus } from "./controllers/countries.controller"
import countriesRouter from "./routes/countries.route"
import errorHandler from "./utils/errorHandler"

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app = express()

app.use(morgan("dev"))

app.use(helmet())

app.disable("x-powered-by")

app.use(limiter)

app.use(cors())

app.use(express.json({ limit: "10kb" }))

app.use(express.urlencoded({ extended: true }))

app.get("/status", countriesStatus)

app.use("/countries", countriesRouter)

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.use(errorHandler)

export default app
