import { CardBasket } from "../components/Cart";

export type PaymentType = 'online' | 'offline';

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

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
  order: IOrder;
}

export interface IOrderForm {
  address: string;
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm {
  payment: PaymentType;
  total: number;
  items: string[];
}