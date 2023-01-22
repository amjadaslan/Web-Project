import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { UserInfo } from '../../../Models/UserInfo';
import { Box, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { SendLogoutRequest } from './AppbarAxiosCalls';

const theme = createTheme();

export interface EcommerceAppBarProps {
    userInfo: UserInfo;
    appBarTitle: string
}

export const EcommerceAppBar: React.FC<EcommerceAppBarProps> = ({ userInfo, appBarTitle }) => {
    const navigate = useNavigate();
    const permissionMap = new Map<string, string>([
        ["A", "ADMIN"],
        ["M", "MANAGER"],
        ["W", "WORKER"],
        ["U", "USER"]
    ])

    const nameInfo: string = userInfo.permission == "U" ?
        userInfo.username
        :
        `${userInfo.username} | ${permissionMap.get(userInfo.permission)}`;

    function makeButton(label: string, path: string) {
        return <Box sx={{ px: 1 }} >
            <Button variant="contained" color='info' onClick={() => navigate(path)}>{label}</Button>
        </Box>;
    }

    const backOfficeButtons = userInfo.permission == "U" ? <></> : <>
        {makeButton("Product Dashboard", "/productdashboard")}
        {makeButton("Order Dashboard", "/orderdashboard")}
    </>

    return (<AppBar position="sticky">
        <Toolbar>
            <Typography variant="h6">
                {appBarTitle}
            </Typography>
            <div style={{ flexGrow: 1 }} />
            {makeButton("Catalog", "/catalog")}
            {backOfficeButtons}
            <Box sx={{ pl: 2 }}>
                <Avatar src={"avatar"} />
            </Box>
            <Typography style={{ margin: '0 8px' }}>
                {nameInfo}
            </Typography>
            <IconButton color="inherit" onClick={() => { navigate('/cart') }}>
                <ShoppingCartIcon />
            </IconButton>
            <IconButton color="inherit" onClick={SendLogoutRequest}>
                <Logout />
            </IconButton>
        </Toolbar>
    </AppBar>);
}