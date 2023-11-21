import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  public _id?: string;
  @prop({ required: true })
  public name!: string;
  @prop({ required: true, unique: true })
  public email!: string;
  @prop({ required: false })
  public phone!: string;
  @prop({ required: true })
  public password!: string;
  @prop({ required: true, default: false })
  public isAdmin!: boolean;
  @prop({ type: () => Object })
  public shippingAddress!: object;
  @prop({ type: () => [Object] })
  public currentCart!: {
    image: string | undefined
    slug: string
    quantity: number
    countInStock: number
    price: number
    _id: string
    name: string }[];
}

export const UserModel = getModelForClass(User);