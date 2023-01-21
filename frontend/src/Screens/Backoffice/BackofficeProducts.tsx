import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Grid, List, ListItem, TextField } from '@mui/material';
import axios from 'axios';
import { apiGatewayUrl } from '../components/constants';
import { Product } from '../../Models/Product';
import {EcommerceAppBar} from '../components/EcommerceAppBar';

axios.defaults.withCredentials = true;

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open } = props;

    const handleButtonClick = async () => {
        console.log(productName)
        console.log(category)
        console.log(description)
        console.log(price)
        console.log(stock)
        console.log(imageUrl)
        if (productName != "" && category != "" && description != "" && price > 0 && stock > 0 && imageUrl != "") {
            await axios({
                method: 'POST',
                url: `${apiGatewayUrl}/api/product`,
                data: {
                    "name": productName,
                    "category": category,
                    "description": description,
                    "price": price,
                    "stock": stock,
                    "image": imageUrl
                }
            }).then(response => {
                console.log(response);
                onClose(`Added ${productName}`)

            }).catch((error) => {
                console.log(error);
                onClose('ERROR: Not added')
            });
        }
    };

    const handleClose = () => {
        onClose("Meh")
    };

    const [productName, setProductName] = React.useState<string>("");
    const [category, setCategory] = React.useState<string>("puzzle");
    const [description, setDescription] = React.useState<string>("");
    const [price, setPrice] = React.useState<number>(0);
    const [stock, setStock] = React.useState<number>(0);
    const [imageUrl, setImageUrl] = React.useState<string>("");

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Enter Product Details</DialogTitle>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        onChange={(newVale) => setProductName(newVale.target.value)}
                        required
                        id="productname"
                        name="productname"
                        label="Product Name"
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        disabled
                        defaultValue={'puzzle'}
                        onChange={(newVale) => setCategory(newVale.target.value)}
                        required
                        id="category"
                        name="category"
                        label="Category"
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        onChange={(newVale) => setDescription(newVale.target.value)}
                        required
                        multiline
                        id="description"
                        name="description"
                        label="Description"
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField type='number'
                        onChange={(newVale) => setPrice(Number(newVale.target.value))}
                        required
                        id="price"
                        name="price"
                        label="Price"
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField type='number'
                        onChange={(newVale) => setStock(Number(newVale.target.value))}
                        required
                        id="stock"
                        name="stock"
                        label="Stock"
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        onChange={(newVale) => setImageUrl(newVale.target.value)}
                        required
                        id="imageurl"
                        name="imageurl"
                        label="Image Url"
                        fullWidth
                        variant="standard"
                    />
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleButtonClick}>
                Add Product
            </Button>
        </Dialog>
    );
}

export default function BackOfficeProductsPage() {
    React.useEffect(() => {
        const fetchProducts = async () => {
            await axios({
                method: 'GET',
                url: `${apiGatewayUrl}/api/product/all`
            }).then(response => {
                console.log(response.data);
                setAllProducts(response.data.map((obj: any) => obj as Product));
            }).catch((error) => {
                console.log(error);
            });

            // await new Promise(resolve => setTimeout(resolve, 1000));
            // navigate("cart");
        }
        fetchProducts();
    }, []);

    const [allProducts, setAllProducts] = React.useState<Product[]>([]);

    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('None');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
        console.log(value)
    };

    return (
        <div>
            <EcommerceAppBar appBarTitle='Backoffice Products'/>
            <Typography variant="subtitle1" component="div">
                Product: {selectedValue}
            </Typography>
            <br />
            <Button variant="outlined" onClick={handleClickOpen}>
                Add Product
            </Button>
            <List sx={{ pt: 0 }}>
                {allProducts.map((prd, index) => (
                    <ListItem>
                        {index}.<Button variant="contained" color="primary" onClick={async () => {
                            await axios({
                                method: 'DELETE',
                                url: `${apiGatewayUrl}/api/product/${prd.id}`
                            }).then(response => {
                                console.log(response);
                            }).catch((error) => {
                                console.log(error);
                            });
                        }}>
                            Delete {prd.name} with id: {prd.id}
                        </Button>
                    </ListItem>
                ))}
            </List>
            <List sx={{ pt: 0 }}>
                {allProducts.map((prd, index) => (
                    <ListItem>
                        {index}.<Button variant="contained" color="primary" onClick={() => { }}>
                            Edit {prd.name} with id: {prd.id}
                        </Button>
                    </ListItem>
                ))}
            </List>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}