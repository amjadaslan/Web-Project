import { Grid, Paper, Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import { useState } from "react";
import { Order } from "../../../Models/Order";
import { MarkAsDelivered } from "./OrderDashboardAxiosCalls";

export interface OrderCardProps {
    order: Order
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    async function handleMarkAsDelivered(orderId: string) {
        console.log(orderId)
        await MarkAsDelivered(orderId);
        setOpenDialog(true);
    }

    const buttonText = order.status == "Pending" ? "Mark As Delivered" : "Delivered";
    const buttonDisabled = order.status != "Pending";

    return <Grid item xs={6}>
        <div>
            <Paper elevation={1}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h3">
                            {`ID: ${order.id}`}
                        </Typography>
                        {secondaryTypography(`Customer: ${order.customerName}`)}
                        {secondaryTypography(`Address: ${order.address}`)}
                        {secondaryTypography(`Status: ${order.status}`)}
                    </CardContent>
                    <CardActions>
                        <Button disabled={buttonDisabled} onClick={() => handleMarkAsDelivered(order.id)}>{buttonText}</Button>
                    </CardActions>
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