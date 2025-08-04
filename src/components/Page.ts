import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface IPage {
  catalogContainer: HTMLElement[];
  cartCount: number;
  locked?: boolean;
}

export class Page extends Component<IPage> {
  protected catalog: HTMLElement;
  protected cartCountElement: HTMLElement;
  protected wrapper: HTMLElement;
  
  constructor(container: HTMLElement) {
    super(container);
    this.catalog = ensureElement('.gallery', this.container);
    this.cartCountElement = ensureElement('.header__basket-counter', this.container);
    this.wrapper = ensureElement('.page__wrapper', this.container);

  }

  set catalogContainer(value: HTMLElement[]) {
    this.catalog.replaceChildren(...value);
  }

  set cartCount(value: number) {
    this.setText(this.cartCountElement, value.toString());
  }

  set locked(value: boolean) {
    if (value) {
        this.wrapper.classList.add('page__wrapper_locked');
    } else {
        this.wrapper.classList.remove('page__wrapper_locked');
    }
    }

}