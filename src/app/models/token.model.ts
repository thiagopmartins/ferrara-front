import { User } from "./user.model";

export interface Token {
  token?: string;
  user?: User;
}
