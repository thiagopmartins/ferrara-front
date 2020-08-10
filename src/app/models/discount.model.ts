import { DiscountTypeEnum } from '../utils/enums/DiscountTypeEnum';

export interface Discount {
  _id?: string;
  name?: string;
  expireDate?: string;
  value?: number;
  type?: DiscountTypeEnum;
  partner?: string;
  totalUse?: number;
}
