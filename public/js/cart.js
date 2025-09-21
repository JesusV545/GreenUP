/* exported addToCart */

const CART_STORAGE_KEY = 'cart';

function addToCart(id, name, imageURL, price) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  cart.push({ id, name, imageURL, price });
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

if (typeof window !== 'undefined') {
  window.addToCart = addToCart;
}

if (typeof document !== 'undefined' && typeof Handlebars !== 'undefined') {
  const templateSource = document.getElementById('cart-template');
  const cartContainer = document.getElementById('cart-items');

  if (templateSource && cartContainer) {
    const cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    const template = Handlebars.compile(templateSource.innerHTML);
    cartContainer.innerHTML = template({ cartItems });
  }
}
