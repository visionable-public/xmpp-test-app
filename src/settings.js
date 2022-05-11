import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Button,
  Checkbox,
  TextField,
} from '@mui/material';

import { QRCodeSVG } from 'qrcode.react'

import { Auth } from "aws-amplify";

const Settings = ({ client, me, onClose, open }) => {
  const [mfa, setMfa] = useState(false);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(async () => {
    const user = await Auth.currentAuthenticatedUser();
    const mfaType = await Auth.getPreferredMFA(user);
    setMfa(mfaType === 'SOFTWARE_TOKEN_MFA')
    setLoading(false);
  }, []);

  const setupTOTP = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const { attributes: { email } } = user;

    const code = await Auth.setupTOTP(user);
    const issuer = "Visionable"; // TODO: ?
    const str = `otpauth://totp/Visionable:${email}?secret=${code}&issuer=${issuer}`;
    setQr(str);
  }

  const onMfaChange = async () => {
    const user = await Auth.currentAuthenticatedUser();
    setMfa(!mfa);

    if (!mfa) {
      setupTOTP();
    } else {
      Auth.setPreferredMFA(user, 'NOMFA');
    }
  }

  const onTokenChange = (e) => {
    setToken(e.target.value);
  };

  const checkToken = async () => {
    const user = await Auth.currentAuthenticatedUser();

    Auth.verifyTotpToken(user, token)
      .then(() => {
        Auth.setPreferredMFA(user, 'TOTP');
        alert("Successfully enabled MFA")
        setQr(null);
      })
      .catch((e) => {
        console.log("ERROR", e);
        alert("Error enabling MFA");
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Settings</DialogTitle>

      <DialogContent>
        {loading
          ? <div>Loading</div>
          : <>
            <FormControlLabel control={<Checkbox onChange={onMfaChange} checked={mfa} />} label="Enable MFA" />

            {mfa && qr && <>
              <br />
              <QRCodeSVG value={qr} size={200} />
              <br />
              <TextField
                sx={{ my: 1 }}
                onChange={onTokenChange}
                label="Verification Code"
                InputProps={{endAdornment: <Button disabled={!token} onClick={checkToken}>Verify</Button>}}
                />
              </>}
          </>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings
