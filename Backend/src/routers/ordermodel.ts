import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { Product } from './productModel'
import { User } from './userModel'


class item {
  @prop({ required: true })
  public name!: string
  @prop({ required: true })
  public quantity!: string
  @prop({ required: true })
  public image!: string
  @prop({ required: true })
  public price!: number
  @prop({ ref: Product })
  public product?: Ref<Product>
}

class paymentResult {
  @prop()
  public paymentId!: string
  @prop()
  public status!: string
  @prop()
  public update_time!: string
  @prop()
  public email_address!: string
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Order {
  public _id!: string;
  @prop()
  public orderItems!: item[];
  @prop({ type: () => Object })
  public shippingAddress!: object;
  @prop({ ref: User })
  public user?: Ref<User>;
  @prop()
  public phone?: number;
  @prop({ required: true })
  public paymentMethod!: string;
  @prop()
  public paymentResult?: paymentResult;
  @prop({ required: true, default: 0 })
  public itemsPrice!: number;
  @prop({ required: true, default: 0 })
  public shippingPrice!: number;
  @prop({ required: true, default: 0 })
  public taxPrice!: number;
  @prop({ required: true, default: 0 })
  public totalPrice!: number;
  @prop({ required: true, default: false })
  public isPaid!: boolean;
  @prop()
  public paidAt!: string;
  @prop({ required: true, default: false })
  public isDelivered!: boolean;
  @prop()
  public deliveredAt!: string;
  @prop({ required: true })
  public status!: number;
  
}

export const OrderModel = getModelForClass(Order)

