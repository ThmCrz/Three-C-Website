import express, {Request, Response} from 'express'
import asyncHandler from 'express-async-handler'
import { productModel } from '../models/productModel'
import { ProductList } from '../ProductList'

export const seedRouter = express.Router()

seedRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        await productModel.deleteMany({})
        const createdProducts = await productModel.insertMany(ProductList)
        res.json({createdProducts})
    })
        ) 