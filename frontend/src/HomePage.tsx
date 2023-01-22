import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { redirect, useNavigate } from 'react-router';

const theme = createTheme();

axios.defaults.withCredentials = true;

export interface HomePageProps {
    isLoading: number,
    setIsLoading: React.Dispatch<React.SetStateAction<number>>
}

export const LoadingPage: React.FC<HomePageProps> = ({ isLoading, setIsLoading }) => {
    const navigate = useNavigate();
    if (isLoading == 1) {
        navigate("/signin");
    } else if (isLoading == 2) {
        navigate("/catalog");
    }

    return <>Loading</>;
}