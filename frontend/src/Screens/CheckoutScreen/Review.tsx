import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { PaymentDetails } from '../../Models/PaymentDetails';
import { CartItem } from '../../Models/Cart';
import { ShippingDetails } from '../../Models/ShippingDetails';

const addresses = ['1 MUI Drive', 'Reactville', 'Anytown', '99999', 'USA'];

export interface ReviewProps {
    paymentDetails: PaymentDetails,
    shippingDetails: ShippingDetails,
    cartItems: CartItem[]
}

export const Review: React.FC<ReviewProps> = ({ paymentDetails, shippingDetails, cartItems }) => {
    const paymentFields = [
        { name: 'Card holder', value: paymentDetails.cardHolder },
        { name: 'Card number', value: paymentDetails.cardNumber },
        { name: 'Expiry date', value: paymentDetails.expiryDate },
    ];

    const totalPrice = cartItems.reduce((sum, item) => (sum + item.quantity * item.product.price), 0);
    const fullName = `${shippingDetails.firstName} ${shippingDetails.lastName}`;
    const fullAddress = `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.zip}, ${shippingDetails.country}`

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            <List disablePadding>
                {cartItems.map((cartItem) => (
                    <ListItem key={cartItem.product.id} sx={{ py: 1, px: 0 }}>
                        <ListItemText primary={cartItem.product.name} secondary={`Quantity: ${cartItem.quantity}`} />
                        <Typography variant="body2">{`${cartItem.product.price * cartItem.quantity}$`}</Typography>
                    </ListItem>
                ))}
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {`${totalPrice}$`}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Shipping
                    </Typography>
                    <Typography gutterBottom>{fullName}</Typography>
                    <Typography gutterBottom>{fullAddress}</Typography>
                </Grid>
                <Grid item container direction="column" xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Payment details
                    </Typography>
                    <Grid container>
                        {paymentFields.map((field) => (
                            <React.Fragment key={field.name}>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>{field.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>{field.value}</Typography>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}