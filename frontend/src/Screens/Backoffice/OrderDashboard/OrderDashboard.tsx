import { Box, Fab, Grid, SxProps } from "@mui/material";
import { FC, useState } from "react";
import { Order } from "../../../Models/Order";
import { EcommerceAppBar } from "../../components/EcommerceAppbar/EcommerceAppBar";
import { ProductCard } from "../ProductDashboard/ProductCard";
import { OrderCard } from "./OrderCard";

export interface OrderDashboardProps {
    setAppBarTitle: React.Dispatch<React.SetStateAction<string>>;
    allOrders: Order[],
    setAllOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

export const OrderDashboard: FC<OrderDashboardProps> = ({ setAppBarTitle, allOrders, setAllOrders }) => {
    setAppBarTitle('Orders Dashboard');

    return <div>
        <Box>
            <Box>
                <Grid container spacing={2} padding={2}>
                    {allOrders.map(order => <OrderCard key={order.id} order={order} />)}
                </Grid>
            </Box>
        </Box>
    </div>;
}