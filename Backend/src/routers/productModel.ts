import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  @prop({ type: String, default: () => new Types.ObjectId().toString() })
  public _id?: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public slug!: string;

  @prop({ required: true })
  public image?: string;

  @prop({ required: true })
  public category?: string;

  @prop({ required: true })
  public brand?: string;

  @prop({ required: true, default: 0 })
  public price!: number;

  @prop({ required: true, default: 0 })
  public countInStock!: number;

  @prop({ required: true })
  public description?: string;
}

export const productModel = getModelForClass(Product);