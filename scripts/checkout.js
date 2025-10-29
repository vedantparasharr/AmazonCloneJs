// Show checkout page

import { renderHTML } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";

// backend practice
// import '../data/backend-practice.js'


Promise.all([
    new Promise((resolve) => {
        loadProducts(() => {
            resolve();
        });
    })
]).then(() => {
    renderHTML();
    renderPaymentSummary();
})


// // Show sections
// loadProducts(() => {
//     renderHTML();
//     renderPaymentSummary();
// })
