import {
    Grid, Card, CardContent, Typography, Button, makeStyles,
} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { exampleProduct } from '../debug';
import { apiGatewayUrl } from './components/constants';
import { EcommerceAppBar } from './components/EcommerceAppBar';

// const useStyles = makeStyles((theme) => ({
//     card: {
//         marginBottom: theme.spacing(2),
//     },
//     checkoutCard: {
//         position: 'sticky',
//         top: theme.spacing(2),
//     },
// }));

export default function CartPage() {
    let cartItems = [exampleProduct(), exampleProduct(), exampleProduct()];

    const [total, setTotal] = React.useState(0);
    React.useEffect(() => {
        let totalPrice = 0;
        cartItems.forEach((item) => {
            totalPrice += item.price * item.stock;
        });
        setTotal(totalPrice);
    }, [cartItems]);

    const navigate = useNavigate();

    return (
        <div>
            <EcommerceAppBar appBarTitle='My Cart' />
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {cartItems.map((item) => (
                        <Grid item xs={12} key={item.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="h3">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" component="p">
                                        Quantity: {item.stock}
                                    </Typography>
                                    <Typography variant="h6" component="h4">
                                        Price: ${item.price * item.stock}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3">
                                Total: ${total}
                            </Typography>
                            <Button variant="contained" color="primary" onClick={async () => {
                                navigate("/checkout");
                            }}>
                                Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}