import express, {Request , Response } from 'express'
import asyncHandler from "express-async-handler";
import { isAuth } from '../Utils'
import { OrderModel } from './ordermodel';
import { Product } from './productModel';

export const orderRouter = express.Router()

orderRouter.get(
  '/mine',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ user: req.user._id })
    res.send(orders)
  })
)

orderRouter.get(
  '/admin',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find()
    res.send(orders)
  })
)

orderRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)

orderRouter.post(
    '/',
    isAuth,
    asyncHandler(async (req: Request, res: Response ) => {
        if (req.body.orderItems.length === 0) {
            res.status(400).send({ message: 'Cart is empty' })
          } else {
            const createdOrder = await OrderModel.create({
              orderItems: req.body.orderItems.map((x: Product) => ({
                ...x,
                product: x._id,
              })),
              shippingAddress: req.body.shippingAddress,
              paymentMethod: req.body.paymentMethod,
              itemsPrice: req.body.itemsPrice,
              shippingPrice: req.body.shippingPrice,
              taxPrice: req.body.taxPrice,
              totalPrice: req.body.totalPrice,
              user: req.user._id,
              phone: req.body.phone,
              status: 1
            })
            res
              .status(201)
              .send({ message: 'Order Not Found', order: createdOrder })
          }
    })
)

orderRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)

    if (order) {
      order.isPaid = true
      order.paidAt = new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Manila' })
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }
      const updatedOrder = await order.save()

      res.send({ order: updatedOrder, message: "Order Paid Successfully" })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.put(
  '/:id/status',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)

    if (order) {
      order.status += 1; // Increment the status by 1
      const updatedOrder = await order.save();

      res.send({ order: updatedOrder, message: "Status Updated" })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.put(
  '/:id/cancel',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)

    if (order) {
      order.status = -1;
      const updatedOrder = await order.save();

      res.send({ order: updatedOrder, message: "Status Updated" })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.put(
  '/:id/completed',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)

    if (order) {
      order.status += 1; // Increment the status by 1
      order.deliveredAt = new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Manila' })
      order.isDelivered = true
      order.isPaid = true
      order.paidAt = new Date(Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Manila' })
      const updatedOrder = await order.save();

      res.send({ order: updatedOrder, message: "Order Completed" })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)