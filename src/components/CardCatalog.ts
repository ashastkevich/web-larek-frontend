import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class CardCatalog extends Component<IProduct> {
  protected cardCategory: HTMLElement;
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardButton: HTMLButtonElement;
  protected productId: string;

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

  set id(value: string) {
    this.productId = value;
  };

  set category(value: string) {
    this.setText(this.cardCategory, value);
  }
  set title(value: string) {
    this.setText(this.cardTitle, value);
  }
  set price(value: number) {
    this.setText(this.cardPrice, value);
  }
  set image(value: string) {
    this.setImage(this.cardImage, value);
  }
}