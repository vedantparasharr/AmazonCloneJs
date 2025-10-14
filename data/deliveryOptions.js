// Purpose: Provide delivery options and a helper to fetch one by id (no logic changes).

// Get a delivery option by id (returns first as fallback)
export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliverOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  return deliveryOption || deliverOptions[0];
}

// Available delivery options (kept export name to avoid breaking imports)
export const deliverOptions = [
  {
    id: 1,
    deliveryDays: 7,
    priceCents: 0
  }, {
    id: 2,
    deliveryDays: 3,
    priceCents: 499
  }, {
    id: 3,
    deliveryDays: 1,
    priceCents: 999
  }
];
