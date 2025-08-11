import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export class Card<T> extends Component<T> {
  protected cardCategory: HTMLElement;
  protected cardTitle: HTMLElement;
  protected cardDescription: HTMLElement;
  protected cardPrice: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected productId: string;
  protected categoryColors = <Record<string, string>>{ 
    "софт-скил": 'soft', 
    "другое": 'other', 
    "кнопка": 'button', 
    "хард-скил": 'hard', 
    "дополнительное": 'additional' 
  }

  constructor(container: HTMLElement) {
    super(container);

  }

  set id(value: string) {
    this.productId = value;
  };

  get id(): string {
    return this.productId;
  }

  set title(value: string) {
    this.setText(this.cardTitle, value);
  }

  set price(value: number) {
    this.setText(this.cardPrice, value != null ? `${value} синапсов` : `Бесценно`);
  }

  set image(value: string) {
    this.setImage(this.cardImage, value);
  }

  set category(value: string) { 
    this.setText(this.cardCategory, value); 
    if (this.cardCategory) { 
      this.cardCategory.className = `card__category card__category_${this.categoryColors[value]}`; 
    } 
  }
}

export class CardCatalog extends Card<IProduct> {
  protected cardButton: HTMLButtonElement;
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.cardCategory = ensureElement('.card__category', this.container);
    this.cardTitle = ensureElement('.card__title', this.container);
    this.cardPrice = ensureElement('.card__price', this.container);
    this.cardImage = ensureElement('.card__image', this.container) as HTMLImageElement;
    this.cardButton = this.container as HTMLButtonElement;
    this.cardButton.addEventListener('click', () => {
      this.events.emit('product:click', {id: this.productId} as IProduct);
    });
  }
}


export class CardPreview extends Card<IProduct> {
  protected cardButtonCart: HTMLButtonElement;


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

  set description(value: string) {
    this.setText(this.cardDescription, value);
  }

  disableButton(): void {
    this.setDisabled(this.cardButtonCart, true);
  }

  updateButton(isInCart: boolean) {
    this.setText(this.cardButtonCart, isInCart ? 'Удалить из корзины' : 'В корзину');
  }
}