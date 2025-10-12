import { addProductToCart, cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utilities/money.js";
import { getTotalCartQuantity, ifCartEmpty } from "../data/cart.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"
import { deliverOptions } from "../data/deliveryOptions.js";

document.querySelector('.return-to-home-link').innerHTML = `${getTotalCartQuantity(cart)} Items`;

let cartSummaryHTML = ``;

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliverOptionId = cartItem.deliverOptionsId;
  let deliverOption;
  deliverOptions.forEach((option) => {
    if(option.id === deliverOptionId){
      deliverOption = option;
    }
  })

  const today = dayjs();
    const deliveryDate = today.add(deliverOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');


  cartSummaryHTML += `
    <div class="cart-item-container 
      js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${matchingProduct.image}>

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id = ${matchingProduct.id}>
                    Update
                  </span>
                  <input type="number" class="quantity-input" min="1" max="99" step="1">
                  <span class = "save-quantity-link link-primary js-save-quantity-link" data-product-id = "${matchingProduct.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-button" data-product-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliverOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
`;
});

function deliverOptionsHTML(matchingProduct, cartItem) {
  let html = '';
  deliverOptions.forEach((deliverOption) => {

    const today = dayjs();
    const deliveryDate = today.add(deliverOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliverOption.priceCents === 0? 'FREE' : `$${formatCurrency(deliverOption.priceCents)} - `;
    const isChecked = Number(deliverOption.id) === cartItem.deliverOptionsId;
    html += 
    `
            <div class="delivery-option">
                  <input type="radio" ${isChecked ? 'checked': ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                    >
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
            </div>      
    `
  })

  return html;
}

const orderSummary = document.querySelector('.js-order-summary');
orderSummary.innerHTML = cartSummaryHTML;
ifCartEmpty(cart);

document.querySelectorAll('.js-delete-quantity-button').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    if (container) {
      container.remove();
    }
    ifCartEmpty(cart);
    document.querySelector('.return-to-home-link').innerHTML = `${getTotalCartQuantity(cart)} Items`;
  })
})

document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const inputField = container.querySelector('.quantity-input');

    inputField.value = container.querySelector('.quantity-label').innerHTML;

    container.classList.add('is-editing-quantity');
  });
});

document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    const inputField = container.querySelector('.quantity-input');
    const newValue = Number(inputField.value);
    if (newValue === 0) {
      const cartItem = cart.find(item => item.productId === productId);
      removeFromCart(productId);
      container.remove();
      document.querySelector('.return-to-home-link').innerHTML = `${getTotalCartQuantity(cart)} Items`;
      ifCartEmpty(cart)
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    else if (newValue > 0) {
      container.classList.remove(`is-editing-quantity`);
      const cartItem = cart.find(item => item.productId === productId);
      if (cartItem) {
        cartItem.quantity = newValue;
      }
      container.querySelector('.quantity-label').innerHTML = newValue;
      document.querySelector('.return-to-home-link').innerHTML = `${getTotalCartQuantity(cart)} Items`;
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      alert('Not a valid input');
    }
  });

});


