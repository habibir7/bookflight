import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routes";

const app = express()
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'))
app.use("/",router)

app.listen(3000, () =>
  console.log(`⚡️[server]: Server is running at https://localhost:3000`)
)