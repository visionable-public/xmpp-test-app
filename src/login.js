import {
  Button,
  TextField,
  Stack
} from "@mui/material";

const LoginView = ({
  loading,
  username,
  onChangeUsername,
  password,
  onChangePassword,
  error,
  signIn
  }) => (
  <Stack spacing={3} sx={{ width: "400px", maxWidth: "100%", my: 3, mx: "auto" }}>
    <TextField label="Username" disabled={loading} onChange={onChangeUsername} value={username} error={!!error} />

    <TextField label="Password" disabled={loading} onKeyDown={(e) => e.key === "Enter" && signIn()} type="password" onChange={onChangePassword} value={password} error={!!error} helperText={error && "Invalid credentials"} />

    <Button variant="contained" disabled={loading} onClick={signIn}> Sign in </Button>
  </Stack>
);

export default LoginView;
