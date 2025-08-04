import { IAppState, IOrder, IProduct } from "../types";
import { EventEmitter } from "./base/events";

export class AppState implements IAppState {
  catalog: IProduct[] = [];
  cart: IProduct[] = [];
  order: IOrder = {
    payment: 'online',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
  };

  constructor(protected events: EventEmitter) {
    

  }

  setCatalog(catalog: IProduct[]): void {
    this.catalog = catalog;
    this.events.emit('catalog:changed');
  }

  getCatalog(): IProduct[] {
    return this.catalog;
  }

  getCart(): IProduct[] {
    return this.cart;
  }

  getCartCount(): number {
    return this.cart.length;
  }
  addToCart(product: IProduct): void {
    if (!this.cart.some(item => item.id === product.id)) {
      this.cart.push(product);
      this.events.emit('cart:changed');
    }
  }

  removeFromCart({id}: Partial<IProduct>): void {
    this.cart = this.cart.filter(product => product.id !== id);
    this.events.emit('cart:changed');

  }

  clearCart(): void {
    this.cart = [];
    this.events.emit('cart:changed');
  }
}