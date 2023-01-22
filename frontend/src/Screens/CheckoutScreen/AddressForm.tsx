import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FC } from 'react';
import { ShippingDetails } from '../../Models/ShippingDetails';

export interface AddressFormProps {
    shippingDetails: ShippingDetails,
    setShippingDetails: React.Dispatch<React.SetStateAction<ShippingDetails>>
}

export const AddressForm: FC<AddressFormProps> = ({ shippingDetails, setShippingDetails }) => {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Shipping address
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label="First name"
                        value={shippingDetails.firstName}
                        onChange={(val) => setShippingDetails(shippingDetails.UpdateFirstName(val.target.value))}
                        fullWidth
                        autoComplete="given-name"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="lastName"
                        name="lastName"
                        label="Last name"
                        value={shippingDetails.lastName}
                        onChange={(val) => setShippingDetails(shippingDetails.UpdateLastName(val.target.value))}
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="address1"
                        name="address1"
                        label="Address line"
                        value={shippingDetails.address}
                        onChange={(val) => setShippingDetails(shippingDetails.UpdateAddress(val.target.value))}
                        fullWidth
                        autoComplete="shipping address-line1"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="city"
                        name="city"
                        label="City"
                        value={shippingDetails.city}
                        onChange={(val) => setShippingDetails(shippingDetails.UpdateCity(val.target.value))}
                        fullWidth
                        autoComplete="shipping city"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="state"
                        name="state"
                        label="State / Province"
                        value={shippingDetails.state}
                        onChange={(val) => setShippingDetails(shippingDetails.UpdateState(val.target.value))}
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="zip"
                        name="zip"
                        label="Zip / Postal code"
                        value={shippingDetails.zip}
                        onChange={(val) => setShippingDetails(shippingDetails.UpdateZip(val.target.value))}
                        fullWidth
                        autoComplete="shipping postal-code"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="country"
                        name="country"
                        label="Country"
                        value={shippingDetails.country}
                        onChange={(val) => setShippingDetails(shippingDetails.UpdateCountry(val.target.value))}
                        fullWidth
                        autoComplete="shipping country"
                        variant="standard"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}