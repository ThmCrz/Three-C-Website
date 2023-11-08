import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { productRouter } from "./routers/productRouter";
import { userRouter } from "./routers/userRouter";
import { orderRouter } from "./routers/orderRouter";
import { keyRouter } from "./routers/keyRouter";
// import { seedRouter } from "./routers/seedRouter";


dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/Three-C-DataBase";
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(() => {
    console.log("failed to connect to MongoDB");
  });

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
// app.use('/api/seed', seedRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/keys', keyRouter)

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
