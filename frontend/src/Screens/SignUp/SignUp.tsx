import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { apiGatewayUrl } from '../components/constants';
import { SendSignUpRequest } from './SignUpAxiosCalls';

const theme = createTheme();

export default function SignUp() {

  const [hasError, setHasError] = useState<boolean>(false);

  const [securityQuestion, setSecurityQuestion] = useState<string>("How old are you?");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username'), password = data.get('password'),
      answer = data.get('answer');

    if (username == '' || password == '' || answer == '') {
      console.log('Please fill required fields');
      setHasError(true);
      return;
    }
    await SendSignUpRequest(username, password, securityQuestion, answer);
  };

  const questions = ["How old are you?", "What is your mom's name?", "Who is you favorite teacher from Technion?", "How many brothers do you have?"]

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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={hasError}
                  helperText={hasError ? "Field must not be Empty" : ""}
                  name="username"
                  id="username"
                  label="Username"
                  autoComplete="username"
                  onChange={() => setHasError(false)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={hasError}
                  helperText={hasError ? "Field must not be Empty" : ""}
                  name="password"
                  id="password"
                  label="Password"
                  autoComplete="new-password"
                  type="password"
                  onChange={() => setHasError(false)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Security Question</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={securityQuestion}
                    label="Security Question"
                    onChange={(val) => setSecurityQuestion(val.target.value)}
                  >
                    {questions.map((question) => <MenuItem value={question}>{question}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="answer"
                  error={hasError}
                  helperText={hasError ? "Field must not be Empty" : ""}
                  onChange={() => setHasError(false)}
                  id="answer"
                  label="Answer"
                  type="answer"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="http://reddit.com" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}