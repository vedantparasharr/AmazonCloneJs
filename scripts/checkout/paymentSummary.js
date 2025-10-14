import { cart, getTotalCartQuantity } from "../../data/cart.js"
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utilities/money.js";


export function renderPaymentSummary() {

    let totalItems = getTotalCartQuantity(cart);
    let totalPrice = 0;
    let shippingCost = 0;
    cart.forEach((item)=> {
        let productId = item.productId;
        let matchingProduct = getProduct(productId);
        totalPrice += (item.quantity * matchingProduct.priceCents);
        let deliveryOption = getDeliveryOption(item.deliverOptionsId);
        shippingCost += deliveryOption.priceCents;
    })
    
    let itemPrice = formatCurrency(totalPrice);
    let shippingPrice = formatCurrency(shippingCost);
    let totalBeforeTaxPrice = formatCurrency(totalPrice + shippingCost);
    let taxPrice = formatCurrency((totalPrice + shippingCost) * 0.1);
    let orderTotal = formatCurrency(totalPrice + shippingCost + taxPrice * 100) 

    document.querySelector('.js-payment-summary').innerHTML = `

    
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

          <button class="place-order-button button-primary">
            Place your order
          </button>
        `
} 
