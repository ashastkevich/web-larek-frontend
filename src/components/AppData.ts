import { FormErrors, IAppState, IOrder, IOrderForm, IProduct } from "../types";
import { EventEmitter } from "./base/events";

export class AppState implements IAppState {
  protected catalogList: IProduct[] = [];
  protected cartList: IProduct[] = [];
  protected orderList: IOrder = {
    payment: 'online',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
  };
  formErrors: FormErrors = {};

  constructor(protected events: EventEmitter) {
  }

  set catalog(catalog: IProduct[]) {
    this.catalogList = catalog;
    this.events.emit('catalog:changed');
  }

  get catalog(): IProduct[] {
    return this.catalogList;
  }

  get cart(): IProduct[] {
    return this.cartList;
  }

  set cart(cart: IProduct[]) {
    this.cartList = cart;
  }

  set order(order: IOrder) {
    this.orderList = order;
  }

  get order(): IOrder {
    return this.orderList;
  }

  getCartCount(): number {
    return this.cartList.length;
  }

  getCartTotal(): number {
    let sum = 0;
    this.cartList.forEach(item => {
      sum += item.price;
    })
    return sum;
  }

  addToCart(product: IProduct): void {
    if (!this.cartList.some(item => item.id === product.id)) {
      this.cartList.push(product);
      this.orderList.total = this.getCartTotal();
      this.events.emit('cartCount:changed');
    }
  }

  removeFromCart({id}: Partial<IProduct>): void {
    this.cartList = this.cartList.filter(product => product.id !== id);
    this.orderList.total = this.getCartTotal();
    this.events.emit('cartCount:changed');
  }

  isInCart({id}: Partial<IProduct>): boolean {
    return this.cartList.some(p => p.id === id);
  }

  clearCart(): void {
    this.cartList = [];
    this.orderList.total = this.getCartTotal();
    this.events.emit('cartCount:changed');
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.orderList[field] = value;
    this.validateOrder();
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.orderList.address) {
        errors.address = 'Необходимо указать адрес';
    }
    if (!this.orderList.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.orderList.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }


}