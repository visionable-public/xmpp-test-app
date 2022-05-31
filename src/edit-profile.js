
import { useState, useEffect } from 'react';
import {
  Stack,
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

import { Auth } from "aws-amplify";

const EditProfile = ({ client, me, onClose, open }) => {
  const [loading, setLoading] = useState(true);
  // const [vCard, setVCard] = useState(null);

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");

  const save = () => {
    const vCard = {
      fullName,
      title: title,
      records: [
        { type: "tel", value: phone },
        { type: "title", value: title },
        { type: "organization", value: organization },
      ],
    };
    client.publishVCard(vCard);
    onClose();
  };

  useEffect(async () => {
    if (open) {
      try {
        const res = await client.getVCard(client.config.jid);
        console.log("GOT VCARD", res);

        setFullName(res.fullName || "");

        res.records?.forEach(r => {
          if (r.type === "tel") {
            setPhone(r.value);
          } else if (r.type === "title") {
            setTitle(r.value);
          } else if (r.type === "organization") {
            setOrganization(r.value);
          }
        });

        setLoading(false);
      } catch(e) {
        setLoading(false);
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Profile</DialogTitle>

      <DialogContent>
        {loading
          ? <div>Loading</div>
          : <Stack sx={{ m: 1, display: 'flex', gap: "1em" }}>
              <TextField onChange={e => setFullName(e.target.value)} label="Full Name (TODO)" defaultValue={fullName} />
              <TextField onChange={e => setPhone(e.target.value)} label="Phone" defaultValue={phone} />
              <TextField onChange={e => setOrganization(e.target.value)} label="Organization" defaultValue={organization} />
            </Stack>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={save}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfile
