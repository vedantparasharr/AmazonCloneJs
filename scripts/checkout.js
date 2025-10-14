// File: scripts/checkout.js
// Purpose: Orchestrate checkout page sections by rendering order and payment summaries.

// --- Imports ---
import { renderHTML } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

// --- Render sections ---
renderHTML();
renderPaymentSummary();
