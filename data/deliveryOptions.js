// Get delivery option by id
export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliverOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  return deliveryOption || deliverOptions[0];
}

// Delivery options list
export const deliverOptions = [
  {
    id: 1,
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: 2,
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: 3,
    deliveryDays: 1,
    priceCents: 999
  }
];
