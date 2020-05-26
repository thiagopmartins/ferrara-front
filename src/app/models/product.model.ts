import { CategoryEnum } from '../utils/enums/CategoryEnum';

export interface Product {
  _id?: string,
  name?: string,
  description?: string,
  category?: CategoryEnum,
  price?: number;
}
