import {
    Grid, Card, CardContent, Typography, Button, makeStyles,
} from '@mui/material';
import * as React from 'react';
import { prodExample } from './Catalog';
import EcommerceAppBar from './components/EcommerceAppBar';

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
    let cartItems = [new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample(), new prodExample()]

    const [total, setTotal] = React.useState(0);
    React.useEffect(() => {
        let totalPrice = 0;
        cartItems.forEach((item) => {
            totalPrice += item.price * item.quantity;
        });
        setTotal(totalPrice);
    }, [cartItems]);

    return (
        <div>
            <EcommerceAppBar/>
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
                                        Quantity: {item.quantity}
                                    </Typography>
                                    <Typography variant="h6" component="h4">
                                        Price: ${item.price * item.quantity}
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
                            <Button variant="contained" color="primary">
                                Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}