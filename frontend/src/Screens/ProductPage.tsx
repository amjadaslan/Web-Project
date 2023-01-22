import * as React from 'react';
import {
    Grid, Card, CardMedia, CardContent, Typography, Button,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import axios from 'axios';
import { apiGatewayUrl } from './components/constants';
import { exampleProduct } from '../debug';
import { Product } from '../Models/Product';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router';

// const useStyles = makeStyles({
//     card: {
//         height: '400px',
//         position: 'relative',
//     },
//     media: {
//         height: '300px',
//     },
//     name: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         background: 'rgba(255, 255, 255, 0.5)',
//         padding: '8px 16px',
//     },
// });

export interface ProductPageProps {
    setAppBarTitle: React.Dispatch<React.SetStateAction<string>>;
    productsInCart: Product[]
}

export const ProductPage: FC<ProductPageProps> = ({ setAppBarTitle, productsInCart }) => {
    const navigate = useNavigate();
    let { productId } = useParams();

    if (productId == undefined) {
        navigate("/cart");
        return <>Undefined</>;
    }

    const product = productsInCart.find((cartProduct) => cartProduct.id == productId) || exampleProduct();
    setAppBarTitle(`Product Page - ${product.name}`);

    return (
        <div>
            {/* <EcommerceAppBar appBarTitle='Product Page' /> */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            image={product.image}
                            title={product.name}
                        />
                        <CardContent>
                            <Typography variant="h4" component="h2">
                                {product.name}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
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
                                //name, category, description, price, stock, image
                                onClick={async () => {
                                    await axios({
                                        method: 'POST',
                                        url: `${apiGatewayUrl}/api/product`,
                                        data: {}
                                    })
                                }}
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