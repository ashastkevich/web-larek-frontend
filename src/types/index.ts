import { CardBasket } from "../components/Cart";

export type PaymentType = 'online' | 'offline';

export interface IProduct {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
  image: string;
  isIncluded?: boolean;
  index?: number;
}

export interface IProductResponse {
  total: number;
  items: IProduct[];
}

export interface IBasket {
  items: HTMLElement[] | string;
  total: number;
}

export interface IAppState {
  catalog: IProduct[];
  cart: IProduct[];
}

export interface IOrderFrom {
  payment: PaymentType;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IOrderFrom {
  total: number;
  items: string[];
}