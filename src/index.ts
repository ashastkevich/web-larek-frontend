import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { Basket, CardBasket } from './components/Cart';
import { LarekAPI } from './components/LarekAPI';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const cardTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
const basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
const orderTemplate = ensureElement('#order') as HTMLTemplateElement;
const contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement;
const successTemplate = ensureElement('#success') as HTMLTemplateElement;
// const orderForm = ensureElement('')

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



api.getProducts()
  .then(products => {
    appData.setCatalog(products.items);
  })
  .catch(error => console.log(error));

events.on('catalog:changed', () => {
  const productsHTMLArray = appData.getCatalog().map(product => new CardCatalog(cloneTemplate(cardTemplate), events).render(product));
  page.render({
    catalogContainer: productsHTMLArray
  });
})

events.on('product:click', ({id}: {id: string}) => {
  const product = appData.getCatalog().find(item => item.id === id);
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
  cardPreview.isInCart = (appData.getCart().some(item => item.id === id)) ? true : false;
  modalPreviewContainer.content = cardPreview.render(product);
  modalPreviewContainer.open();
});

events.on('cart:add', (product: CardPreview) => {
  if (appData.getCart().some(item => item.id === product.id)) {
    appData.removeFromCart({id: product.id});
    product.updateButton(false);
  } else {
    const newProduct = appData.getCatalog().find(item => item.id === product.id);
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
  const basketHTMLArray = appData.getCart().map((basketItem, itemIndex) => new CardBasket(cloneTemplate(cardBasketTemplate), events).render({...basketItem, index: itemIndex+1}));
  const basketHTML = basket.render({items: basketHTMLArray, total: appData.getCartTotal()});
  if (basketHTMLArray.length === 0) {
    basket.button = true;
    const basketHTML = basket.render({items: 'Корзина пуста', total: appData.getCartTotal()});
  } else basket.button = false;
    modalBasketContainer.content = basketHTML;
})

events.on('order:open', () => {
  modalBasketContainer.close();
  // modalOrderContainer.content = modalOrderContainer(cloneTemplate(orderTemplate), events).render();
  modalOrderContainer.open();
})


events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});