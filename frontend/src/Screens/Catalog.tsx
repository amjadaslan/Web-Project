import * as React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { EcommerceAppBar } from './components/EcommerceAppbar/EcommerceAppBar';
import { useNavigate } from 'react-router';
import { Product } from '../Models/Product';
import { FC } from 'react';

// const useStyles = makeStyles(() =>
//   createStyles({
//     root: {
//       padding: '24px',
//     },
//   }),
// );

export interface CatalogProps {
  setAppBarTitle : React.Dispatch<React.SetStateAction<string>>;
  allProducts: Product[]
}

export const Catalog: FC<CatalogProps> = ({ setAppBarTitle, allProducts }) => {
  const navigate = useNavigate();
  setAppBarTitle("Product Catalog");

  return (
    <div>
      <div>
        <Grid container spacing={3}>
          {allProducts.map((product) => (
            <Grid item xs={3} key={Math.random() as React.Key}>
              <Card>
                <CardMedia
                  image={product.image}
                  title={product.name}
                  style={{ height: '150px' }}
                />
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {product.name}  |  {product.price}$ | Stock: {product.stock}
                  </Typography>
                  <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                    {product.category}
                  </Typography>
                  <Button variant="contained" color="primary" onClick={()=>navigate(`/productpage/${product.id}`)}>
                    View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}