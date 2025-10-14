export function getDeliveryOption(deliverOptionId){
    let deliverOption;
        deliverOptions.forEach((option) => {
            if (option.id === deliverOptionId) {
                deliverOption = option;
            }
        })
        return deliverOption || deliverOptions[0] ;
}

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