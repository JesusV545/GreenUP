const CART_STORAGE_KEY = 'cart';

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
};

const writeCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const addToCart = (product) => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const items = readCart();
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += product.quantity;
    existing.line_total = (existing.quantity * existing.unit_price).toFixed(2);
  } else {
    items.push({
      ...product,
      quantity: product.quantity,
      unit_price: product.unit_price,
      line_total: (product.quantity * product.unit_price).toFixed(2),
    });
  }

  writeCart(items);
};

const showTransientMessage = (message) => {
  if (!message || typeof document === 'undefined') return;
  let toast = document.querySelector('[data-cart-toast]');

  if (!toast) {
    toast = document.createElement('div');
    toast.setAttribute('data-cart-toast', '');
    toast.className =
      'toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-4';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body"></div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    document.body.appendChild(toast);
  }

  const body = toast.querySelector('.toast-body');
  if (body) {
    body.textContent = message;
  }

  if (window.bootstrap?.Toast) {
    const toastInstance = window.bootstrap.Toast.getOrCreateInstance(toast, { delay: 2500 });
    toastInstance.show();
  }
};

const hydrateCartView = () => {
  if (typeof document === 'undefined') return;
  const cartPage = document.querySelector('[data-cart-page]');
  if (!cartPage) return;

  const list = cartPage.querySelector('[data-cart-list]');
  const subtotalEl = cartPage.querySelector('[data-cart-subtotal]');
  const taxEl = cartPage.querySelector('[data-cart-tax]');
  const totalEl = cartPage.querySelector('[data-cart-total]');
  const emptyAlert = cartPage.querySelector('[data-cart-empty]');

  if (!list) return;

  const items = readCart();

  if (!items.length) {
    list.innerHTML = '';
    if (emptyAlert) {
      emptyAlert.style.display = 'block';
    }
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (taxEl) taxEl.textContent = '$0.00';
    if (totalEl) totalEl.textContent = '$0.00';
    return;
  }

  if (emptyAlert) {
    emptyAlert.style.display = 'none';
  }

  const fragment = document.createDocumentFragment();
  let subtotal = 0;

  items.forEach((item) => {
    const row = document.createElement('tr');
    const itemTotal = Number(item.unit_price) * Number(item.quantity || 0);
    subtotal += itemTotal;

    row.innerHTML = `
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="${item.imageURL}" alt="${item.name}" loading="lazy" />
          <div>
            <p class="mb-0 fw-semibold">${item.name}</p>
            ${item.category ? `<small class="text-muted text-uppercase">${item.category}</small>` : ''}
          </div>
        </div>
      </td>
      <td class="text-center">${item.quantity}</td>
      <td class="text-end">$${Number(item.unit_price).toFixed(2)}</td>
      <td class="text-end">$${itemTotal.toFixed(2)}</td>
    `;

    fragment.appendChild(row);
  });

  list.innerHTML = '';
  list.appendChild(fragment);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
};

if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;

    const { productId, productName, productImage, productPrice } = button.dataset;
    if (!productId) return;

    const unitPrice = Number.parseFloat(productPrice);
    addToCart({
      id: productId,
      name: productName,
      imageURL: productImage,
      unit_price: unitPrice,
      quantity: 1,
    });

    button.blur();
    showTransientMessage(`${productName || 'Item'} added to cart.`);
    hydrateCartView();
  });

  document.addEventListener('DOMContentLoaded', () => {
    hydrateCartView();
  });
}

if (typeof window !== 'undefined') {
  window.addToCart = (id, name, imageURL, price) =>
    addToCart({ id, name, imageURL, unit_price: price, quantity: 1 });
}
