export class PaymentDetails {
    constructor(
        readonly cardHolder: string = "",
        readonly cardNumber: string = "",
        readonly expiryDate: string = "",
        readonly cvv: string = "",
        readonly coupon: string = ""
    ) { }

    UpdateCardHolder(newCardHolder: string): PaymentDetails {
        return new PaymentDetails(newCardHolder, this.cardNumber, this.expiryDate, this.cvv, this.coupon)
    }

    UpdateCardNumber(newCardNumber: string): PaymentDetails {
        return new PaymentDetails(this.cardHolder, newCardNumber, this.expiryDate, this.cvv, this.coupon)
    }

    UpdateExpiryDate(newExpiryDate: string): PaymentDetails {
        return new PaymentDetails(this.cardHolder, this.cardNumber, newExpiryDate, this.cvv, this.coupon)
    }

    UpdateCvv(newCvv: string): PaymentDetails {
        return new PaymentDetails(this.cardHolder, this.cardNumber, this.expiryDate, newCvv, this.coupon)
    }

    UpdateCoupon(newCoupon: string): PaymentDetails {
        return new PaymentDetails(this.cardHolder, this.cardNumber, this.expiryDate, this.cvv, newCoupon)
    }
}