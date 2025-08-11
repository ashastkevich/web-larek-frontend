import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { CardCatalog, CardPreview } from './components/Card';
import { Basket, CardBasket } from './components/Cart';
import { LarekAPI } from './components/LarekAPI';
import { Modal } from './components/Modal';
import { Contacts, Order, Success } from './components/Order';
import { Page } from './components/Page';
import './scss/styles.scss';
import { IOrder, IOrderForm, IProduct, PaymentType } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const cardTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
const basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
const orderTemplate = ensureElement('#order') as HTMLTemplateElement;
const contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement;
const successTemplate = ensureElement('#success') as HTMLTemplateElement;

const modalPreview = ensureElement('#modal-preview');
const modalBasket = ensureElement('#modal-basket');
const modalOrder = ensureElement('#modal-order');
const modalContacts = ensureElement('#modal-contacts');
const modalSuccess = ensureElement('#modal-success');

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState(events);
const page = new Page(document.querySelector('.page') as HTMLElement, events);
const modalPreviewContainer = new Modal(modalPreview, events)
const modalBasketContainer = new Modal(modalBasket, events);
const modalOrderContainer = new Modal(modalOrder, events);
const modalContactsContainer = new Modal(modalContacts, events);
const modalSuccessContainer = new Modal(modalSuccess, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);


api.getProducts()
  .then(products => {
    appData.catalog = products.items;
  })
  .catch(error => console.log(error));

events.on('catalog:changed', () => {
  const productsHTMLArray = appData.catalog.map(product => new CardCatalog(cloneTemplate(cardTemplate), events).render(product));
  page.render({
    catalogContainer: productsHTMLArray
  });
})

events.on('product:click', ({id}: {id: string}) => {
  const product = appData.catalog.find(item => item.id === id);
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
  if (product.price === null) {
    cardPreview.disableButton();
  } else {
    cardPreview.updateButton(appData.isInCart({id}));
  }
  modalPreviewContainer.content = cardPreview.render(product);
  modalPreviewContainer.open();
});

events.on('cart:add', (product: CardPreview) => {
  if (appData.cart.some(item => item.id === product.id)) {
    appData.removeFromCart({id: product.id});
    product.updateButton(false);
  } else {
    const newProduct = appData.catalog.find(item => item.id === product.id);
    if (newProduct) {
      appData.addToCart(newProduct);
      product.updateButton(true);
    }
  }
});

events.on('cartItem:remove', (product: CardBasket) => {
  appData.removeFromCart({id: product.id});
  events.emit('cart:change');
})

events.on('cartCount:changed', () => {
  page.render({
    cartCount: appData.getCartCount()
  })
});

events.on('cart:open', () => {
  events.emit('cart:change');
  modalBasketContainer.open();
});

events.on('cart:change', () => {
  const basketHTMLArray = appData.cart.map((basketItem, itemIndex) => new CardBasket(cloneTemplate(cardBasketTemplate), events).render({...basketItem, index: itemIndex+1}));
  const basketHTML = basket.render({items: basketHTMLArray, total: appData.getCartTotal()});
  if (basketHTMLArray.length === 0) {
    basket.button = true;
    const basketHTML = basket.render({items: 'Корзина пуста', total: appData.getCartTotal()});
  } else if (appData.getCartTotal() === 0) {
    basket.button = true
  } else basket.button = false;
    modalBasketContainer.content = basketHTML;
})

events.on('order:open', () => {
  modalBasketContainer.close();
  appData.order.items = appData.cart.map(product => product.id);
  modalOrderContainer.content = order.render({...appData.order, valid: false, errors: []});
  order.enable = appData.order.address;
  modalOrderContainer.open();
})

events.on('payment:change', (value: {payment: PaymentType}) => {
  appData.order.payment = value.payment;
  order.payment = value.payment;
})

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
    order.enable = appData.order.address;
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
    contacts.enable = {email: appData.order.email, phone: appData.order.phone};
});


events.on('order:submit', (e: Event) => {
  modalOrderContainer.close();
  modalContactsContainer.content = contacts.render({...appData.order, valid: false, errors: []});
  contacts.enable = {email: appData.order.email, phone: appData.order.phone};
  modalContactsContainer.open();
})

events.on('contacts:submit', (e: Event) => {

  api.setOrder({...appData.order, items: appData.order.items.filter(item => 
    ((appData.catalog.find(p => p.id === item).price != null)))
  })
  .catch(error => console.log(error));
  modalContactsContainer.close();
  modalSuccessContainer.content = success.render(appData.order);
  modalSuccessContainer.open();
  appData.clearCart();
  appData.order = {
    payment: 'online',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
  };
})

events.on('success:close', () => {
  modalSuccessContainer.close();
})

events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { address, email, phone } = errors;
    contacts.valid = !address && !email && !phone;
    contacts.errors = Object.values({phone, email, address}).filter(i => !!i).join('; ');
    order.valid = !address;
    order.errors = Object.values({address}).filter(i => !!i).join('; ');
});


events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});