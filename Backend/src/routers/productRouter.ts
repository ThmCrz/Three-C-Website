import express from "express";
import asyncHandler from "express-async-handler";
import { productModel } from "../models/productModel";
import { isAuth } from "../Utils";

export const productRouter = express.Router();


productRouter.post(
  '/newProduct',
  isAuth,
  asyncHandler(async (req, res) => {



    try {
      const newProduct = await productModel.create({
        name: req.body.name,
        slug: req.body.name.replace(/\s+/g, "-").toLowerCase(),
        image: req.body.image || "No Image Provided",
        category: req.body.category || "No Category",
        brand: req.body.brand || "No brand Provided",
        price: req.body.price,
        countInStock: req.body.countInStock || 0,
        description: req.body.description || "No description Provided",
      });

      res.json(newProduct);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

productRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const products = await productModel.find();
      // If the products array is empty, return a 204 No Content status
      if (products.length === 0) {
        res.status(204).send();
      } else {
        // If products are found, return a 200 OK status along with the products
        res.status(200).json(products);
      }
    } catch (error) {
      // If there's an error, return a 500 Internal Server Error status
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
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

  productRouter.put(
    "/:id/update",
    isAuth,
    asyncHandler(async (req, res) => {
      const product = await productModel.findOne({ _id: req.params.id });
      if (product) {
        // Update the properties of the product based on the request body
        product.name = req.body.name;
        product.slug = req.body.slug;
        // product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.price = req.body.price;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        // Save the updated product
        await product.save();
  
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
  );

  productRouter.put(
    "/deleteProduct/:id",
    isAuth,
    asyncHandler(async (req, res) => {
      const product = await productModel.findOne({ _id: req.params.id });
      if (product) {
        await productModel.deleteOne({ _id: req.params.id }); // Delete the product
        res.json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
  );

  productRouter.put(
  "/DeductQuantityFromOrder",
  isAuth,
  asyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      try {
        const orderItems = req.body.orderItems;
        for (const cartItem of orderItems) {
          const product = await productModel.findById(cartItem._id);
          if (product) {
            product.countInStock -= cartItem.quantity;
            await product.save();
          }
        }
        res.status(200).json({ message: "Quantity deducted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  })
);

productRouter.put(
  "/AddQuantityFromCancelledOrder",
  isAuth,
  asyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      try {
        const orderItems = req.body.orderItems;
        for (const cartItem of orderItems) {
          const product = await productModel.findById(cartItem._id);
          if (product) {
            product.countInStock += cartItem.quantity;
            await product.save();
          }
        }
        res.status(200).json({ message: "Quantity deducted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  })
);

