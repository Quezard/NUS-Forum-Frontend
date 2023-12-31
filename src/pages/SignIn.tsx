import UserContext from "../contexts/UserContext";
import { createSession, createSessionParams } from "../lib/api/session";
import { newUser } from "../types/User";
import { signin } from "../lib/helper/tokenManager";

import React, { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const SignIn: React.FC = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [remember, setRemember] = useState(false);

    // if signed in
    if (user.id !== -1) {
        return <Navigate replace to="/" />;
    }

    function validateInput(params: createSessionParams): boolean {
        // validate input
        if (!(params.email && params.password)) {
            alert("email and password cannot be empty");
            return false;
        }

        return true;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const params: createSessionParams = {
            email: data.get("email")!.toString().trim(),
            password: data.get("password")!.toString(),
        };

        if (!validateInput(params)) {
            return;
        }

        // create session from API
        try {
            const response = await createSession(params);
            // set userID
            setUser(newUser(response.data.userId, response.data.username));
            console.log("signed in");

            // store token
            signin(response.data.authToken, remember);

            // navigate back
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("email or password is incorrect");
        }
    }

    function handleCheckBox(event: React.ChangeEvent<HTMLInputElement>) {
        setRemember(event.target.checked);
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                    <FormControlLabel
                        control={
                            <Checkbox value="remember" color="primary" checked={remember} onChange={handleCheckBox} />
                        }
                        label="Remember me"
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default SignIn;
