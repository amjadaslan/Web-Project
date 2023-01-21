export class Order {
    constructor(
        readonly orderId: string = "",
        readonly customerName: string = "",
        readonly address: string = "",
        readonly status: string = ""
    ) { }
}