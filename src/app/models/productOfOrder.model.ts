import { Product } from './product.model';

export interface ProductOfOrder {
  products: Product[];
  additional: Product;
  description: string;
}
