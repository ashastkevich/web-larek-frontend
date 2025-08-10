import { IOrder, PaymentType } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { Form } from "./Form";


export class Order extends Form<IOrder> {
  protected buttonOnlinePayment: HTMLButtonElement;
  protected buttonOfflinePayment: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
     this.buttonOnlinePayment = this.container.elements.namedItem('card') as HTMLButtonElement;
     this.buttonOfflinePayment = this.container.elements.namedItem('cash') as HTMLButtonElement;
     this.buttonOnlinePayment.addEventListener('click', () => {
      events.emit('payment:change', {payment: 'online'})
     })
      this.buttonOfflinePayment.addEventListener('click', () => {
      events.emit('payment:change', {payment: 'offline'})
     })

  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  set payment(value: PaymentType) {
    this.toggleClass(this.buttonOnlinePayment, 'button_alt-active', value === 'online');
    this.toggleClass(this.buttonOfflinePayment, 'button_alt-active', value === 'offline');
  }

  set enable(value: string) {
    if (value) {
      this.setDisabled(this._submit, false);
    } else {
      this.setDisabled(this._submit, true);
    }
  }


}


export class Contacts extends Form<IOrder> {
  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
  }

set email(value: string) {
  (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
}

set phone(value: string) {
  (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
}


set enable(data: {email: string, phone: string}) {
  if (data.email && data.phone) {
    this.setDisabled(this._submit, false);
  } else {
    this.setDisabled(this._submit, true);
  }
}

}


export class Success extends Component <IOrder> {
  protected orderSuccessDescription: HTMLElement;
  protected finishButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this.orderSuccessDescription = ensureElement('.order-success__description', this.container);
    this.finishButton = ensureElement('.order-success__close', this.container) as HTMLButtonElement;
    this.finishButton.addEventListener('click', () => {
      events.emit('success:close');
    })
  }

  set total(value: number) {
    this.setText(this.orderSuccessDescription, `Списано ${value} синапсов`);
  }

}