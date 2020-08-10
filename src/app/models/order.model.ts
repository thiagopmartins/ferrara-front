import { Discount } from './discount.model';
import { Product } from './product.model';
import { Customer } from './customer.model';
import { ProductOfOrder } from './productOfOrder.model';

export interface Order {
  customer?: Customer;
  productsOfOrder?: ProductOfOrder[];
  price?: number;
  discount?: Discount;
}
