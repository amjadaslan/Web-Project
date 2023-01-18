import {
    Card,
    CardContent,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    makeStyles
} from '@material-ui/core';
import { useState } from 'react';
import EcommerceAppBar from './components/EcommerceAppBar';

export default function OldCheckout() {

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(3)
        },
        card: {
            height: "100%"
        },
    }));

    const classes = useStyles();

    const [shippingMethod, setShippingMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");

    const handleShippingMethodChange = (event: any) => {
        setShippingMethod(event.target.value);
    };

    const handlePaymentMethodChange = (event: any) => {
        setPaymentMethod(event.target.value);
    };

    const handleNameChange = (event: any) => {
        setName(event.target.value);
    };

    const handleAddressChange = (event: any) => {
        setAddress(event.target.value);
    };

    const handleCityChange = (event: any) => {
        setCity(event.target.value);
    };

    const handleZipChange = (event: any) => {
        setZip(event.target.value);
    };

    return (
        <div>
            <EcommerceAppBar/>
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Shipping
                                </Typography>
                                <FormControl fullWidth>
                                    <InputLabel id="shipping-method-label">Shipping Method</InputLabel>
                                    <Select
                                        labelId="shipping-method-label"
                                        id="shipping-method"
                                        value={shippingMethod}
                                        onChange={handleShippingMethodChange}
                                    >
                                        <MenuItem value={"standard"}>Standard</MenuItem>
                                        <MenuItem value={"express"}>Express</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    margin="normal"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                                <TextField
                                    fullWidth
                                    label="Address"
                                    margin="normal"
                                    value={address}
                                    onChange={handleAddressChange}
                                />
                                <TextField
                                    fullWidth
                                    label="City"
                                    margin="normal"
                                    value={city}
                                    onChange={handleCityChange}
                                />
                                <TextField
                                    fullWidth
                                    label="ZIP"
                                    margin="normal"
                                    value={zip}
                                    onChange={handleZipChange}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Summary
                                </Typography>
                                <Typography>
                                    Shipping Method: {shippingMethod}
                                </Typography>
                                <Typography>
                                    Shipping Address: {name}, {address}, {city}, {zip}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Payment
                                </Typography>
                                <FormControl fullWidth>
                                    <InputLabel id="payment-method-label">Payment Method</InputLabel>
                                    <Select
                                        labelId="payment-method-label"
                                        id="payment-method"
                                        value={paymentMethod}
                                        onChange={handlePaymentMethodChange}
                                    >
                                        <MenuItem value={"credit-card"}>Credit Card</MenuItem>
                                        <MenuItem value={"debit-card"}>Debit Card</MenuItem>
                                        <MenuItem value={"paypal"}>Paypal</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth>
                            Checkout
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

function useStyles() {
    throw new Error('Function not implemented.');
}

