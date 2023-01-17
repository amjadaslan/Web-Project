import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { makeStyles, createStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const theme = createTheme();

export default function EcommerceAppBar(){
return (<AppBar position="static">
    <Toolbar>
        <Typography variant="h6">
            Product Catalog
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <Avatar src={"avatar"} />
        <Typography style={{ margin: '0 8px' }}>
            {"Amjad Aslan"}
        </Typography>
        <IconButton color="inherit">
            <ShoppingCartIcon />
        </IconButton>
    </Toolbar>
</AppBar>);
}