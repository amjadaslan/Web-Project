import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router";
import { CartItem } from "../../Models/Cart";
import { EcommerceAppBar } from "../components/EcommerceAppbar/EcommerceAppBar";
import { CartItemCard } from "./CardItemCard";

export interface CartPageProps {
    setAppBarTitle: React.Dispatch<React.SetStateAction<string>>,
    cartItems: CartItem[],
    setAllCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
}

export const CartPage: FC<CartPageProps> = ({ setAppBarTitle, cartItems, setAllCartItems }) => {
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((sum, item) => (sum + item.quantity * item.product.price), 0);
    setAppBarTitle('My Cart');

    return <div>
        <Box>
            {/* <EcommerceAppBar appBarTitle='My Cart' /> */}
            <Box>
                <Card >
                    <CardContent>
                        <Typography variant="h5" component="h3">
                            Total: {`${totalPrice}$`}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={async () => {
                            navigate("/checkout");
                        }}>
                            Checkout
                        </Button>
                    </CardContent>
                </Card>
                <Grid container spacing={2} padding={2}>
                    {cartItems.map(cartItem => <CartItemCard key={cartItem.product.id} cartItem={cartItem} />)}
                </Grid>
            </Box>
        </Box>
    </div>;
}