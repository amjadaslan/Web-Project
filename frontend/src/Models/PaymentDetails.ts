export class PaymentDetails {
    constructor(
        readonly cardType: string,
        readonly cardHolder: string,
        readonly cardNumber: string,
        readonly expiryDate: string
    ) { }
}