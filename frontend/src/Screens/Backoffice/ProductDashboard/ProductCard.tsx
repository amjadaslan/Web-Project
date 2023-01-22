import { Button, Card, CardActions, CardContent, Grid, Paper, Typography } from "@mui/material"
import { useState } from "react";
import { Product } from "../../../Models/Product"
import { DeleteProduct, EditProduct } from "./ProductDashboardAxiosCalls";
import { ProductDetailsDialog } from "./ProductDetailsDialog";

export interface ProductCardProps {
    product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    async function handleDelete(productId: string) {
        await DeleteProduct(productId)
            .then((_) => {

            })
            .catch((_) => {
                console.log("An Error has occured while deleting product")
            });
    }

    async function handleEdit(productId: string) {
        setOpenDialog(true);
    }

    return <Grid item xs={6}>
        <div>
            <Paper elevation={1}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h3">
                            {product.name}
                        </Typography>
                        {secondaryTypography(`ID: ${product.id}`)}
                        {secondaryTypography(`Category: ${product.category}`)}
                        {secondaryTypography(`Price: ${product.price}$`)}
                        {secondaryTypography(`Stock: ${product.stock}`)}
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => handleEdit(product.id)}>Edit</Button>
                        <Button onClick={() => handleDelete(product.id)}>Delete</Button>
                    </CardActions>
                </Card>
            </Paper>
            <ProductDetailsDialog isOpen={openDialog} setIsOpen={setOpenDialog} existingProduct={product} onConfirm={EditProduct} />
        </div>
    </Grid>;
}

function secondaryTypography(content: string): JSX.Element {
    return <Typography variant="body1" color="textSecondary" component="p">
        {content}
    </Typography>
}