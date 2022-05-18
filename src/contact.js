// import { useState } from "react";

import {
  Popover,
  Badge,
  Box,
  Stack,
  Avatar,
  Typography,
} from "@mui/material";
import GroupsIcon from '@mui/icons-material/Groups';

const Contact = ({ anchorEl, user, onClose }) => {
  console.log("rendering Contact card", user);

  const open = Boolean(anchorEl);

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
            {!user.isRoom && <div>{user.user.user_email}</div>}
          </Box>
        </Stack>

        <br />

        <div>{user.activity}</div>
      </Box>
    </Popover>
  );
};

export default Contact;

// TODO put this is allUsers state
function initials(u) {
  return u.name?.split(" ")?.slice(0, 2)?.map(n => n.substr(0, 1));
}

