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
          phone: user.phone,
          isAdmin: user.isAdmin,
          token: generateToken(user),
          shippingAddress: user.shippingAddress,
          currentCart: user.currentCart,
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
  "/:id/editAccount",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id);

    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.phone = req.body.phone;

      const updatedUser = await user.save();

      res.send({ user: updatedUser, message: "Account Details Updated" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
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
    const cartItem = req.body.cartItem;
    const quantity = req.body.quantity;

    const user = await UserModel.findById(userId);

    if (user) {
      // Check if cartItem is already in currentCart
      const existingCartItem = user.currentCart?.find(
        (item) => item._id === cartItem._id
      );

      if (existingCartItem) {
        existingCartItem.quantity = quantity;
        existingCartItem.price = cartItem.price;
        existingCartItem.countInStock = cartItem.countInStock;

        await UserModel.updateOne(
          { _id: userId, "currentCart._id": cartItem._id },
          {
            $set: {
              "currentCart.$.quantity": quantity,
              "currentCart.$.price": cartItem.price,
              "currentCart.$.countInStock": cartItem.countInStock,
            },
          }
        );
      } else {
        // Item not in the cart, add it with quantity 1
        user.currentCart = user.currentCart || [];
        user.currentCart.push({
          _id: cartItem._id,
          quantity: quantity,
          image: cartItem.image,
          slug: cartItem.slug,
          countInStock: cartItem.countInStock,
          price: cartItem.price,
          name: cartItem.name,
        });
      }

      const updatedUser = await user.save();

      res.send({ user: updatedUser, message: "Cart Added to Cart" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/:id/Cart/DeleteItem",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    //Recieves the request
    const userId = req.params.id;
    const cartItem = req.body.cartItem;

    //tries to find the user
    const user = await UserModel.findById(userId);

    //if user is found.
    if (user) {
      //checks if the cart Item exists in the cart
      const existingCartItem = user.currentCart?.find(
        (item) => item._id === cartItem._id
      );

      //if it exists, then remove it from the cart
      if (existingCartItem) {
        user.currentCart = user.currentCart?.filter(
          (item) => item._id !== cartItem._id
        );
        //saves the user after deleting the item
        await user.save();

        //sends a response back
        res.send({ message: "Cart Item Deleted" });
        return;
      }
    }
    //if the cart Item is not found.
    res.status(404).send({ message: "Cart Item Not Found" });
  })
);

userRouter.put(
  "/:id/Cart/ClearCart",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    //Recieves the userId from request
    const userId = req.params.id;

    //tries to find the user
    const user = await UserModel.findById(userId);

    //if user is found.
    if (user) {
      // remove all items from the cart
      user.currentCart = [];
      // save the user after clearing the cart
      await user.save();

      // send a response back
      res.send({ message: "Cart Cleared" });
    }
    //if the cart Item is not found.
    res.status(404).send({ message: "Cart Item Not Found" });
  })
);
