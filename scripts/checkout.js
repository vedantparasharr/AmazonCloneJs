// File: scripts/checkout.js
// Purpose: Load checkout page and show order summary + payment details.

import { renderHTML } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";

// Load products first, then render checkout sections
async function loadPage() {
  await loadProducts();
  renderHTML();
  renderPaymentSummary();
}

// Run on page load
loadPage();
