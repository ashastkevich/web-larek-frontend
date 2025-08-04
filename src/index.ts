import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { LarekAPI } from './components/LarekAPI';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const cardTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
const modalPreview = ensureElement('#modal-preview');

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState(events);
const page = new Page(document.querySelector('.page') as HTMLElement);
const modalPreviewContainer = new Modal(modalPreview, events)


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
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
  const product = appData.getCatalog().find(item => item.id === id);
  modalPreviewContainer.content = cardPreview.render(product);
  modalPreviewContainer.open();
});

events.on('cart:add', ({id}: {id: string}) => {
  if (appData.getCart().some(item => item.id === id)) {
    appData.removeFromCart({id});
  } else {
    const product = appData.getCatalog().find(item => item.id === id);
    if (product) {
      appData.addToCart(product);
    }
  }
});

events.on('cart:changed', () => {
  page.render({
    cartCount: appData.getCartCount()
  })
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});