import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class CardPreview extends Component<IProduct> {
  protected cardCategory: HTMLElement;
  protected cardTitle: HTMLElement;
  protected cardDescription: HTMLElement;
  protected cardPrice: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardButtonCart: HTMLButtonElement;
  protected cardButtonClose: HTMLButtonElement;
  protected productId: string;
  protected isIncluded: boolean = false;


  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.cardCategory = ensureElement('.card__category', this.container);
    this.cardTitle = ensureElement('.card__title', this.container);
    this.cardDescription = ensureElement('.card__text', this.container);
    this.cardPrice = ensureElement('.card__price', this.container);
    this.cardImage = ensureElement('.card__image', this.container) as HTMLImageElement;
    this.cardButtonCart = ensureElement('.card__button', this.container) as HTMLButtonElement;
    this.cardButtonCart.addEventListener('click', () => {
      this.events.emit('cart:add', this);
    });
  }

  set id(value: string) {
    this.productId = value;
  };

  get id(): string {
    return this.productId;
  }

  set category(value: string) {
    this.setText(this.cardCategory, value);
  }

  set title(value: string) {
    this.setText(this.cardTitle, value);
  }

  set description(value: string) {
    this.setText(this.cardDescription, value);
  }

  set price(value: number) {
    this.setText(this.cardPrice, value);
  }

  set image(value: string) {
    this.setImage(this.cardImage, value);
  }

  set isInCart(value: boolean) {
    this.isIncluded = value;
  }
 

  updateButton(isInCart: boolean) {
    this.setText(this.cardButtonCart, isInCart ? 'Удалить из корзины' : 'В корзину');
    this.isIncluded = isInCart;
  }

  render(data: IProduct): HTMLElement {
    super.render(data);
    this.updateButton(this.isIncluded);
    return this.container;
  }  

}