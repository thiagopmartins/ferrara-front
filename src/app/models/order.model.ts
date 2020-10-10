import { Discount } from './discount.model';
import { Product } from './product.model';
import { Customer } from './customer.model';
import { ProductOfOrder } from './productOfOrder.model';
import { OrderStatusEnum } from '../utils/enums/OrderStatusEnum';
import { Deliveryman } from './deliveryman.model';

export interface Order {
  customer?: Customer;
  productsOfOrder?: ProductOfOrder[];
  price?: number;
  discount?: Discount;
  status?: OrderStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  finishedAt?: Date;
  deliveryman?: Deliveryman;
}
