import { IBasket, IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { Card } from "./Card";




export class Basket extends Component<IBasket> {
  protected basketList: HTMLElement;
  protected orderButton: HTMLButtonElement;
  protected totalPrice: HTMLElement;

  constructor(container:HTMLElement, protected events: IEvents) {
    super(container);
    this.basketList = ensureElement('.basket__list', this.container);
    this.orderButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;
    this.totalPrice = ensureElement('.basket__price', this.container);
    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    })
  }

  set items(value: HTMLElement[] | string) {
    this.basketList.replaceChildren(...value);
  }

  set total(value: number) {
    this.setText(this.totalPrice, `${value} синапсов`);
  }

  set button(state: boolean) {
    this.setDisabled(this.orderButton, state);
  }

}


export class CardBasket extends Card<IProduct> {
  protected basketItemIndex: HTMLElement;
  protected deleteButton: HTMLButtonElement;
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.basketItemIndex = ensureElement('.basket__item-index', this.container);
    this.cardTitle = ensureElement('.card__title', this.container);
    this.cardPrice = ensureElement('.card__price', this.container);
    this.deleteButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;
    this.deleteButton.addEventListener('click', () => {
      this.events.emit('cartItem:remove', this);
    })
  }

  set index(value: number) {
    this.setText(this.basketItemIndex, value.toString());
  }

}

