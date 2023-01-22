import { Box, Fab, Grid, SxProps } from "@mui/material";
import { FC, useState } from "react";
import { Order } from "../../../Models/Order";
import { EcommerceAppBar } from "../../components/EcommerceAppBar";
import { ProductCard } from "../ProductDashboard/ProductCard";
import { OrderCard } from "./OrderCard";

export interface OrderDashboardProps {
    allOrders: Order[],
    setAllOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

export const OrderDashboard: FC<OrderDashboardProps> = ({ allOrders, setAllOrders }) => {
    return <div>
        <Box>
            <EcommerceAppBar appBarTitle='Orders Dashboard | BACKOFFICE' />
            <Box>
                <Grid container spacing={2} padding={2}>
                    {allOrders.map(order => <OrderCard key={order.orderId} order={order} />)}
                </Grid>
            </Box>
        </Box>
    </div>;
}