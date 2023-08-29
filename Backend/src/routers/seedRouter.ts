import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { productModel } from "../models/productModel";
import { ProductList } from "../ProductList";
import { UserModel } from "../models/userModel";
import { sampleUsers } from "../sampleUser";

export const seedRouter = express.Router();

seedRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await productModel.deleteMany({});
    const createdProducts = await productModel.insertMany(ProductList);

    await UserModel.deleteMany({});
    const createdUsers = await UserModel.insertMany(sampleUsers);
    res.send({ createdProducts, createdUsers });

    res.json({ createdProducts });
  })
);
