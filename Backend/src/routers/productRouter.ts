import express from "express";
import asyncHandler from "express-async-handler";
import { productModel } from "../models/productModel";

export const productRouter = express.Router();

productRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await productModel.find();
    res.json(products);
  })
);

productRouter.get(
    "/:slug",
    asyncHandler(async (req, res) => {
      const product = await productModel.findOne({ slug: req.params.slug });
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
  );
