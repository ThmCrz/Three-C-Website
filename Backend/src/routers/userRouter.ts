import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/userModel";
import bcrypt from "bcryptjs";
import { generateToken, isAuth } from "../Utils";

export const userRouter = express.Router();

userRouter.post(
  "/signin",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    } as User);

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  "/:id/shippingAddress",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id);

    if (user) {
      user.shippingAddress = req.body.shippingAddress;

      const updatedUser = await user.save();

      res.send({ user: updatedUser, message: "Shipping Address Updated" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/:id/Cart",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const cartItemId = req.body.itemId;

    const user = await UserModel.findById(userId);

    if (user) {
      // Check if cartItemId is already in currentCart
      const existingCartItem = user.currentCart?.find(
        (item) => item.itemId === cartItemId
      );

      if (existingCartItem) {
        // Item already exists in the cart, increase quantity by 1
        existingCartItem.quantity += 1;

        const index = user.currentCart?.findIndex(
          (item) => item.itemId === cartItemId
        );
        if (index !== -1) {
          await UserModel.updateOne(
            { _id: userId, "currentCart.itemId": cartItemId },
            { $inc: { "currentCart.$.quantity": 1 } }
          );
        } else {
          await UserModel.updateOne(
            { _id: userId },
            { $push: { currentCart: { itemId: cartItemId, quantity: 1 } } }
          );
        }
      } else {
        // Item not in the cart, add it with quantity 1
        user.currentCart = user.currentCart || [];
        user.currentCart.push({ itemId: cartItemId, quantity: 1 });
      }

      const updatedUser = await user.save();

      res.send({ user: updatedUser, message: "Cart Added to Cart" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
