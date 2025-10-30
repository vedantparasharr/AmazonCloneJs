// File: scripts/checkout/paymentSummary.js
// Purpose: Render payment totals based on cart and selected delivery option (no logic changes).

import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { getProduct, products } from "../../data/products.js";
import { formatCurrency } from "../utilities/money.js";
import { cart } from "../../data/cart-class.js";
import { addOrder, renderOrdersHTML } from "../../data/orders.js";

export function renderPaymentSummary() {
  let totalItems = cart.getTotalCartQuantity();
  let totalPrice = 0;
  let shippingCost = 0;

  cart.cartItems.forEach((item) => {
    const productId = item.productId;
    const matchingProduct = getProduct(productId);
    totalPrice += item.quantity * matchingProduct.priceCents;

    // Consistent property name for selected delivery option
    const deliveryOption = getDeliveryOption(item.deliveryOptionId);
    shippingCost += deliveryOption.priceCents;
  });

  // Note: uses existing cents-based math as in your codebase (unchanged).
  const itemPrice = formatCurrency(totalPrice);
  const shippingPrice = formatCurrency(shippingCost);
  const totalBeforeTaxPrice = formatCurrency(totalPrice + shippingCost);
  const taxPrice = formatCurrency((totalPrice + shippingCost) * 0.1);
  const orderTotal = formatCurrency(totalPrice + shippingCost + taxPrice * 100);

  document.querySelector(".js-payment-summary").innerHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${totalItems}):</div>
      <div class="payment-summary-money">$${itemPrice}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${shippingPrice}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${totalBeforeTaxPrice}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${taxPrice}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${orderTotal}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `

  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const cartItems = cart.cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          deliveryOptionId: String(item.deliveryOptionId)
        }));

        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: cartItems })
        });

        const order = await response.json();
        addOrder(order);
        
      } catch (error) {
        console.log('Unexpected Error. Please try again later!');
        throw error;
      }
      window.location.href = 'orders.html';
    });
}
