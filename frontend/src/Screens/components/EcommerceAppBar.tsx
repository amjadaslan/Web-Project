import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { UserInfo } from '../../Models/UserInfo';

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

    return (<AppBar position="sticky">
        <Toolbar>
            <Typography variant="h6">
                {appBarTitle}
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <Avatar src={"avatar"} />
            <Typography style={{ margin: '0 8px' }}>
                {nameInfo}
            </Typography>
            <IconButton color="inherit" onClick={() => { navigate('/cart') }}>
                <ShoppingCartIcon />
            </IconButton>
        </Toolbar>
    </AppBar>);
}