import { Grid, Paper, Card, CardContent, Typography, CardActions, Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CartItem } from "../../Models/Cart";
import { Product } from "../../Models/Product";
import { RemoveItemFromCart, UpdateCartItemQuantity } from "./CartAxiosCalls";

export interface CartItemCardProps {
    cartItem: CartItem
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ cartItem }) => {
    const [quantity, setQuantity] = useState<number>(cartItem.quantity);
    const product: Product = cartItem.product;

    async function handleRemove(productId: string) {
        await RemoveItemFromCart(productId)
            .then((_) => {

            })
            .catch((_) => {
                console.log("An Error has occured while deleting product")
            });
    }

    const navigate = useNavigate();

    return <Grid item xs={6}>
        <div>
            <Paper elevation={1}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h3">
                            {product.name}
                        </Typography>
                        {secondaryTypography(`Price: ${product.price}$`)}
                    </CardContent>
                    <Grid container>
                        <Grid xs={12} sm={6} item>
                            <CardActions>
                                <Button onClick={() => { navigate(`/productpage/${product.id}`) }}>View</Button>
                                <Button onClick={() => handleRemove(product.id)}>Remove</Button>
                            </CardActions>
                        </Grid>
                        <Grid xs={12} sm={6} item>
                            {quantityField(product.id, quantity, product.stock, setQuantity)}
                        </Grid>
                    </Grid>
                </Card>
            </Paper>
        </div>
    </Grid>;
}

function secondaryTypography(content: string): JSX.Element {
    return <Typography variant="body1" color="textSecondary" component="p">
        {content}
    </Typography>
}

function quantityField(productId: string, quantity: number, stock: number, setQuantity: React.Dispatch<React.SetStateAction<number>>): JSX.Element {
    return <TextField
        value={quantity}
        inputProps={{ min: 1, style: { textAlign: 'center' } }}
        type='number'
        onChange={(val) => { UpdateCartItemQuantity(productId, Math.min(Number(val.target.value), stock)); setQuantity(Math.min(Number(val.target.value), stock)); }}
        required
        id={"quantity"}
        name={"quantity"}
        label={"Quantity"}
        fullWidth
        variant="filled"
    />
}