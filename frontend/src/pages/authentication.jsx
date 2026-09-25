import * as React from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Box from "@mui/material/Box";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Snackbar } from "@mui/material";

import { AuthContext } from "../contexts/AuthContext";
import "../styles/authentication.css";

const defaultTheme = createTheme();


export default function Authentication() {

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const navigate = useNavigate();


  const handleAuth = async (e) => {
    // it is use for not reload the browser to new page(For further execution of process)
    e.preventDefault();
    setError("");

    try {
      if(formState === 0)
      {
        await handleLogin(username, password);
      }
      else
      {
        const result = await handleRegister(name, username, password);
        // Now reset the form after finished entry
        setName("");
        setUsername("");
        setPassword("");

        setMessage(result);
        setOpen(true);
        setFormState(0);
      }
    } catch (err) {
      console.log(err);

      const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(errorMessage);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      
      {/* it resets default browser CSS for consistent styling */}
      <CssBaseline />

      <div className="authPage">
        <div className="authCard">

          <Button variant="text" className="backHomeButton" onClick={() => navigate("/")}>
            ← Back to Landing Page
          </Button>

          {/* Logo */}
          <Avatar className="authAvatar">
            <LockOutlinedIcon />
          </Avatar>

          <h1 className="authTitle">YRP Video Call</h1>
          <p className="authSubtitle"> Connect with your loved ones </p>

          {/* Sign In / Sign Up */}
          <div className="authSwitch">
            <Button
              variant={formState === 0 ? "contained" : "outlined"}
              onClick={() => { setFormState(0); setError("");}}
            > Sign In 
            </Button>

            <Button
              variant={formState === 1 ? "contained" : "outlined"}
              onClick={() => { setFormState(1); setError(""); }}
            > Sign Up
            </Button>
          </div>

          {/* Form */}
          <Box component="form" noValidate className="authForm" onSubmit={handleAuth} >

            {formState === 1 && (
              <TextField margin="normal" required fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)}/>
            )}

            <TextField margin="normal" required fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>

            <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

            {error && <p className="authError">{error}</p>}

            <Button type="submit" fullWidth variant="contained" className="authSubmit">
              {formState === 0 ? "Login" : "Register"}
            </Button>

          </Box>
        </div>
      </div>

      <Snackbar open={open} autoHideDuration={4000} message={message} onClose={() => setOpen(false)}/>
        
    </ThemeProvider>
  );
}