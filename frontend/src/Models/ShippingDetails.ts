export class ShippingDetails {
    public firstName: string;
    public lastName: string;
    public address: string;
    public city: string;
    public state: string;
    public zip: string;
    public country: string;

    constructor(
        firstName: string = "",
        lastName: string = "",
        address: string = "",
        city: string = "",
        state: string = "",
        zip: string = "",
        country: string = ""
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.country = country;
    }

    public static copy(shippingDetails: ShippingDetails): ShippingDetails {
        let result: ShippingDetails = new ShippingDetails(shippingDetails.firstName, shippingDetails.lastName, shippingDetails.address, shippingDetails.city, shippingDetails.state, shippingDetails.zip, shippingDetails.country);
        return result;
    }

    UpdateFirstName(newFirstName: string) {
        let result: ShippingDetails = ShippingDetails.copy(this);
        result.firstName = newFirstName;
        return result;
    }

    UpdateLastName(newLastName: string) {
        let result: ShippingDetails = ShippingDetails.copy(this);
        result.lastName = newLastName;
        return result;
    }

    UpdateAddress(newAddress: string) {
        let result: ShippingDetails = ShippingDetails.copy(this);
        result.address = newAddress;
        return result;
    }

    UpdateCity(newCity: string) {
        let result: ShippingDetails = ShippingDetails.copy(this);
        result.city = newCity;
        return result;
    }

    UpdateState(newState: string) {
        let result: ShippingDetails = ShippingDetails.copy(this);
        result.state = newState;
        return result;
    }

    UpdateZip(newZip: string) {
        let result: ShippingDetails = ShippingDetails.copy(this);
        result.zip = newZip;
        return result;
    }

    UpdateCountry(newCountry: string) {
        let result: ShippingDetails = ShippingDetails.copy(this);
        result.country = newCountry;
        return result;
    }
}