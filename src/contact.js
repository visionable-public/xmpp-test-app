import { useState, useEffect } from "react";

import {
  Popover,
  Badge,
  Box,
  Stack,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";

import GroupsIcon from '@mui/icons-material/Groups';

const Contact = ({ client, anchorEl, user, onClose }) => {
  console.log("rendering Contact card", user);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");

  const open = Boolean(anchorEl);

  useEffect(async () => {
    try {
      const res = await client.getVCard(user.jid);
      console.log('got user vcard', res);

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

  }, [anchorEl]);

  const status = user.isRoom ? '' : user.status;
  const color = {
    available: "#51b397",
    away: "#f0a73e",
    unavailable: "gray",
    "in-meeting": "#ea3323",
  }[status] || "gray";

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row">
          <Badge
            componentsProps={{
              badge: {
                sx: {
                  backgroundColor: color,
                  border: "2px solid white",
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                },
              },
            }}
            overlap="circular"
            badgeContent=" "
            invisible={true}
            variant="dot"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Avatar sx={{ width: 56, height: 56 }}>
              {user.isRoom
                ? <GroupsIcon />
                : initials(user)}
            </Avatar>
          </Badge>
          
          <Box sx={{ pl: 2 }}>
            <Typography sx={{ fontWeight: 'bold', p: 0, m: 0 }}>{user.name}</Typography>
            {!user.isRoom && <div>{user.status}</div>}
            {!user.isRoom && <div>{user.user.email}</div>}
          </Box>
        </Stack>

        <br />

        <div>{user.activity}</div>

        <br />

        {loading
          ? <div>Loading...</div>
          : <Stack sx={{ display: 'flex', gap: "1em" }}>
            {false && fullName && <TextField size="small" variant="standard" InputProps={{ readOnly: true }} label="Full Name (TODO)" defaultValue={fullName} />}
            {phone && <TextField size="small" variant="standard" InputProps={{ readOnly: true }} label="Phone" defaultValue={phone} />}
            {organization && <TextField size="small" variant="standard" InputProps={{ readOnly: true }} label="Organization" defaultValue={organization} />}
            {title && <TextField size="small" variant="standard" InputProps={{ readOnly: true }} label="Title" defaultValue={title} />}
          </Stack>}
      </Box>
    </Popover>
  );
};

export default Contact;

// TODO put this is allUsers state
function initials(u) {
  return u.name?.split(" ")?.slice(0, 2)?.map(n => n.substr(0, 1));
}

