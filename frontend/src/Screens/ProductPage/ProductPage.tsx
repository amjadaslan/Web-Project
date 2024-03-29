import * as React from 'react';
import {
    Grid, Card, CardMedia, CardContent, Typography, Button,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import axios from 'axios';
import { apiGatewayUrl } from '../components/constants';
import { exampleProduct } from '../../debug';
import { Product } from '../../Models/Product';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AddToCart } from './ProductPageAxiosCalls';

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
    allProducts: Product[];
}

export const ProductPage: FC<ProductPageProps> = ({ setAppBarTitle, allProducts }) => {
    const navigate = useNavigate();
    let { productId } = useParams();

    if (productId == undefined) {
        navigate("/cart");
        return <>Undefined</>;
    }

    const product = allProducts.find((someProduct) => someProduct.id == productId) || exampleProduct();
    setAppBarTitle("Product Details");

    const handleAddToCart = async (productId: string, quantity: number) => {
        await AddToCart(productId, quantity);
    }

    return (
        <div>
            <br />
            {/* <EcommerceAppBar appBarTitle='Product Page' /> */}
            <Grid container spacing={3}>
                <Grid item xs={6} md={3}></Grid>
                <Grid item xs={6} md={3}>
                    
                    <Card>
                    <img 
                        src={product.image}
                        style={{width: '100%'}}
                    />
                    </Card>
                </Grid>
                <Grid item xs={6} md={3} >
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h3" style={{fontWeight:600}}>
                                {product.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" component="p">
                                {product.description}
                            </Typography><br/>
                            <Typography  color="red" variant="h4"  style={{fontWeight:600}}>
                                ${product.price.toString()}.00
                            </Typography><br/>
                            <Typography  variant="h5" style={{fontWeight:300}} color="textSecondary">
                                Qty: {product.stock}
                            </Typography><br/>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddShoppingCartIcon />}
                                //name, category, description, price, stock, image
                                onClick={() => handleAddToCart(product.id, 1)}
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