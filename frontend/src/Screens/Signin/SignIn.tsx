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
import { apiGatewayUrl } from '../components/constants';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { GetQuestionByUsername, VerifyAnswer } from './SigninAxiosCalls';

const theme = createTheme();

axios.defaults.withCredentials = true;

export default function SignIn() {
    const navigate = useNavigate();

    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         await new Promise(resolve => setTimeout(resolve, 2000));
    //         navigate("/catalog");
    //     }
    //     fetchData();
    // })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username'), password = data.get('password');
        if (username == '' || password == '') {
            console.log('Please fill required fields');
            return;
        }

        await axios({
            method: 'POST',
            url: `${apiGatewayUrl}/api/user/login`,
            data: {
                "username": username,
                "password": password
            },
            withCredentials: true
        }).then(response => {
            //document.cookie = response.headers.cookie || "";
            console.log(response);
            navigate("/catalog");

        }).catch((error) => {
            console.log(error);
        });
    };

    const [pageState, setPageState] = useState<number>(0);

    let text: string;

    if (pageState == 0) {
        text = "Sign in";
    } else if (pageState == 1) {
        text = "Please enter Username";
    } else {
        text = "Forgot Password";
    }

    const [fQuestion, setFQuestion] = useState<string>("");
    const [fUserName, setFUsername] = useState<string>("");
    const [fAnswer, setFAnswer] = useState<string>("");
    const [fPassword, setFPassword] = useState<string>("");

    let editedHandleButton: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;

    if (pageState == 0) {
        editedHandleButton = handleSubmit;
    } else if (pageState == 1) {
        editedHandleButton = async () => { await GetQuestionByUsername(fUserName, setFQuestion); setPageState(pageState + 1); }
    } else {
        editedHandleButton = async () => await VerifyAnswer(fUserName, fAnswer, fPassword);
    }

    const showButtons = pageState == 0 ? <>
        <Grid container>
            <Grid item xs>
                <Link href="#" variant="body2">
                    Forgot password?
                </Link>
            </Grid>
            <Grid item>
                <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                </Link>
            </Grid>
        </Grid>
    </> : <></>;

    const buttonText = pageState == 0 ? "Sign in" : "Enter answer";

    let textFields: JSX.Element;

    if (pageState == 0) {
        textFields = <>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
            >
                {buttonText}
            </Button>
            <Grid container>
                <Grid item xs>
                    <Button href="#" variant="text" size='small' onClick={() => setPageState(1)}>
                        Forgot password?
                    </Button>
                </Grid>
                <Grid item xs>
                    <Button href="#" variant="text" size='small' onClick={() => { }}>
                        {"Don't have an account? Sign Up"}
                    </Button>
                </Grid>
            </Grid>
        </>;
    } else if (pageState == 2) {
        textFields = <>
            <TextField
                margin="normal"
                disabled
                fullWidth
                value={"What is your dad's mom?"}
                name="q"
                label=""
                type="q"
                id="q"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                value={fAnswer}
                onChange={(val) => setFAnswer(val.target.value)}
                name="answer"
                label="Answer"
                type="answer"
                id="answer"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
            >
                {buttonText}
            </Button>
            <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2">
                        Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
        </>;
    } else {
        textFields = <>
            <TextField
                margin="normal"
                required
                fullWidth
                value={fUserName}
                onChange={(val) => setFUsername(val.target.value)}
                name="username"
                label="Username"
                type="username"
                id="username"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
            >
                {buttonText}
            </Button>
            {showButtons}
        </>;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {text}
                    </Typography>
                    <Box component="form" onSubmit={editedHandleButton} noValidate sx={{ mt: 1 }}>
                        {textFields}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}