import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import { productRouter } from "./routers/productRouter";
import { userRouter } from "./routers/userRouter";
import { orderRouter } from "./routers/orderRouter";
import { keyRouter } from "./routers/keyRouter";
import mailRouter from "./routers/nodeMailerRouter";
import saveImageRouter from "./routers/cloudinaryRouter";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://..."; // Your MongoDB URI
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.log("Failed to connect to MongoDB"));

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:4000", "https://three-c-website.onrender.com"],
  })
);

// Configure body-parser to handle larger payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/mail', mailRouter);
app.use('/api/image', saveImageRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/keys', keyRouter);

app.use(express.static(path.join(__dirname, '../../Frontend/dist')));
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../Frontend/dist/index.html'));
});

const PORT: number = parseInt(process.env.PORT || '4000', 10);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
