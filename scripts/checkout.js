// Show checkout page

import { renderHTML } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";

// backend practice
// import '../data/backend-practice.js'


Promise.all([
    loadProducts()
]).then(() => {
    renderHTML();
    renderPaymentSummary();
});