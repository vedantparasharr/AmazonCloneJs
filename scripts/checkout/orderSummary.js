// File: scripts/checkout/orderSummary.js
// Purpose: Render order summary, quantities, and delivery option selection (no logic changes).

import { addProductToCart, cart, removeFromCart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utilities/money.js";
import { getTotalCartQuantity, ifCartEmpty, updateDeliveryOption } from "../../data/cart.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliverOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

// --- Helpers ---
function getDateString(deliveryOption) {
  let date = dayjs();
  let daysToAdd = deliveryOption.deliveryDays;

  while (daysToAdd > 0) {
    date = date.add(1, "day");
    if (date.day() !== 0 && date.day() !== 6) {
      daysToAdd--;
    }
  }
  return date.format("dddd, MMMM D");
}


// --- Render Order Summary ---
export function renderHTML() {
  let cartSummaryHTML = ``;

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    // Consistent property name for selected delivery option
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const dateString = getDateString(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src=${matchingProduct.image}>

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
              <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id=${matchingProduct.id}>
                Update
              </span>
              <input type="number" class="quantity-input" min="1" max="99" step="1">
              <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-quantity-button" data-product-id="${matchingProduct.id}">
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
    let html = "";
    deliverOptions.forEach((deliveryOption) => {
      const dateString = getDateString(deliveryOption);
      const priceString = deliveryOption.priceCents === 0 ? "FREE" : `$${formatCurrency(deliveryOption.priceCents)} - `;
      const isChecked = Number(deliveryOption.id) === Number(cartItem.deliveryOptionId);

      html += `
        <div
          class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input
            type="radio"
            ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `;
    });
    return html;
  }

  const orderSummary = document.querySelector(".js-order-summary");
  orderSummary.innerHTML = cartSummaryHTML;
  ifCartEmpty(cart);

  // --- Header count ---
  document.querySelector(".return-to-home-link").innerHTML = `${getTotalCartQuantity(cart)} Items`;

  // --- Delete item ---
  document.querySelectorAll(".js-delete-quantity-button").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      ifCartEmpty(cart);
      document.querySelector(".return-to-home-link").innerHTML = `${getTotalCartQuantity(cart)} Items`;
      renderHTML();
      renderPaymentSummary();
    });
  });

  // --- Update quantity (enter edit mode) ---
  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      const inputField = container.querySelector(".quantity-input");
      inputField.value = container.querySelector(".quantity-label").innerHTML;
      container.classList.add("is-editing-quantity");
    });
  });

  // --- Save quantity ---
  document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      const inputField = container.querySelector(".quantity-input");
      const newValue = Number(inputField.value);

      if (newValue === 0) {
        const cartItem = cart.find((item) => item.productId === productId);
        removeFromCart(productId);
        container.remove();
        document.querySelector(".return-to-home-link").innerHTML = `${getTotalCartQuantity(cart)} Items`;
        ifCartEmpty(cart);
        localStorage.setItem("cart", JSON.stringify(cart));
      } else if (newValue > 0) {
        container.classList.remove("is-editing-quantity");
        const cartItem = cart.find((item) => item.productId === productId);
        if (cartItem) {
          cartItem.quantity = newValue;
        }
        container.querySelector(".quantity-label").innerHTML = newValue;
        document.querySelector(".return-to-home-link").innerHTML = `${getTotalCartQuantity(cart)} Items`;
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        alert("Not a valid input");
      }
      renderPaymentSummary();
    });
  });

  // --- Select delivery option ---
  document.querySelectorAll(".js-delivery-option").forEach((option) => {
    option.addEventListener("click", () => {
      const { productId, deliveryOptionId } = option.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderHTML();
      renderPaymentSummary();
    });
  });
}
