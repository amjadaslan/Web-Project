import { Box, Fab, Grid, SxProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EcommerceAppBar } from '../../components/EcommerceAppBar';
import { ProductCard } from './ProductCard';
import { FC, useState } from 'react';
import { Product } from '../../../Models/Product';
import { ProductDetailsDialog } from './ProductDetailsDialog';
import { AddProduct } from './ProductDashboardAxiosCalls';

export interface ProductDashboardProps {
    allProducts: Product[],
    setAllProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

export const ProductDashboard: FC<ProductDashboardProps> = ({ allProducts, setAllProducts }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return <div>
        <Box>
            <EcommerceAppBar appBarTitle='Products Dashboard | BACKOFFICE' />
            <Fab color="primary" variant="extended" sx={fabStyle} onClick={() => { setOpenDialog(true) }}>
                <AddIcon />
                Add Product
            </Fab>
            <Box>
                <Grid container spacing={2} padding={2}>
                    {allProducts.map(product => <ProductCard key={product.id} product={product} />)}
                </Grid>
            </Box>
        </Box>
        <ProductDetailsDialog isOpen={openDialog} setIsOpen={setOpenDialog} existingProduct={null} onConfirm={AddProduct} />
    </div>;
}

const fabStyle: SxProps = {
    position: 'fixed',
    bottom: 16,
    right: 16,
};