export class Order {
    constructor(
        readonly id: string = "",
        readonly customerName: string = "",
        readonly address: {streetAddress: any,city: any,state: any,country: any,zipCode: any} = {streetAddress:"",city:"",state:"",country:"",zipCode:""},
        readonly status: string = ""
    ) { }
}