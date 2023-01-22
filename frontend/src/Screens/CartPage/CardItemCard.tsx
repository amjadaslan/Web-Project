import { Grid, Paper, Card, CardContent, Typography, CardActions, Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import { CartItem } from "../../Models/Cart";

export interface CartItemCardProps {
    cartItem: CartItem
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ cartItem }) => {
    const [quantity, setQuantity] = useState<number>(cartItem.quantity);

    return <Grid item xs={6}>
        <div>
            <Paper elevation={1}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h3">
                            {cartItem.product.name}
                        </Typography>
                        {secondaryTypography(`Price: ${cartItem.product.price}$`)}
                    </CardContent>
                    <Grid container>
                        <Grid xs={12} sm={6} item>
                            <CardActions>
                                <Button onClick={() => { }}>View</Button>
                                <Button onClick={() => { }}>Remove</Button>
                            </CardActions>
                        </Grid>
                        <Grid xs={12} sm={6} item>
                            {quantityField(quantity, cartItem.product.stock, setQuantity)}
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

function quantityField(quantity: number, stock: number, setQuantity: React.Dispatch<React.SetStateAction<number>>): JSX.Element {
    return <TextField
        value={quantity}
        inputProps={{ min: 1, style: { textAlign: 'center' } }}
        type='number'
        onChange={(val) => setQuantity(Math.min(Number(val.target.value), stock))}
        required
        id={"quantity"}
        name={"a"}
        label={"Quantity"}
        fullWidth
        variant="filled"
    />
}