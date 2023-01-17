import * as React from 'react';
import {
    Grid, Card, CardMedia, CardContent, Typography, Button,
} from '@material-ui/core';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { prodExample } from './Catalog';

import { makeStyles } from '@material-ui/core/styles';
import EcommerceAppBar from './components/EcommerceAppBar';

const useStyles = makeStyles({
    card: {
        height: '400px',
        position: 'relative',
    },
    media: {
        height: '300px',
    },
    name: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.5)',
        padding: '8px 16px',
    },
});

export default function ProductPage() {
    let product = new prodExample();

    const classes = useStyles();
    return (
        <div>
            <EcommerceAppBar />
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card className={classes.card}>
                        <CardMedia
                            image={product.image}
                            title={product.name}
                            className={classes.media}
                        />
                        <CardContent className={classes.name}>
                            <Typography variant="h4" component="h2">
                                {product.name}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography gutterBottom variant="h4" component="h2">
                                {product.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" component="p">
                                {product.description}
                            </Typography>
                            <Typography variant="h5" component="h3">
                                Price: ${product.price.toString()}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddShoppingCartIcon />}
                            >
                                Add to cart
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}