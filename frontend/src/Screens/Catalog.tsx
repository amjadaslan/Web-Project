import * as React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import EcommerceAppBar from './components/EcommerceAppBar';
import { useNavigate } from 'react-router';
import { Product } from '../Models/Product';
import axios from 'axios';
import { apiGatewayUrl } from './components/constants';

const theme = createTheme();

export class prodExample {
  id: number = 1;
  image: string = "https://i.imgur.com/HsAQOrJ.jpeg";
  name: string = "Some Product";
  description: string = Math.random() < 0.5 ? "This is a short description of the productttttttttttttttttttrtrtrtrttrtrtrtrtrtrtrtrtrtrttrt" : "hi";
  price: number = 123;
  quantity: number = 1;
  category: string = "Computers";
}

// const useStyles = makeStyles(() =>
//   createStyles({
//     root: {
//       padding: '24px',
//     },
//   }),
// );

export default function Catalog() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProducts = async () => {
      await axios({
        method: 'GET',
        url: `${apiGatewayUrl}/api/product/all`
      }).then(response => {
        console.log(response.data);
        setAllProducts(response.data.map((obj: { id: string, type: string; name: string; category: string; description: string; price: number; stock: number; image: string; }) => new Product(obj.id, obj.type, obj.name, obj.category, obj.description, obj.price, obj.stock, obj.image)));
      }).catch((error) => {
        console.log(error);
      });

      // await new Promise(resolve => setTimeout(resolve, 1000));
      // navigate("cart");
    }
    fetchProducts();
  }, []);

  const [allProducts, setAllProducts] = React.useState<Product[]>([]);


  let products = allProducts;

  return (
    <div>
      <EcommerceAppBar />
      <div>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={3} key={Math.random() as React.Key}>
              <Card>
                <CardMedia
                  image={product.imageUrl}
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
                  <Button variant="contained" color="primary">
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