import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Circle from '@mui/icons-material/Circle';

const Profile = ({ client, me }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setStatus = (status) => {
    client.sendPresence({ status });
  };

  const statusList = [
    {
      key: "available",
      color: "#53b397",
      label: "Available",
      icon: Circle,
    },
    {
      key: "in-meeting",
      color: "#ea3323",
      label: "In a meeting",
      icon: Circle,
    },
    {
      key: "away",
      color: "#f0a73e",
      label: "Away",
      icon: Circle,
    },
  ]

  return (
    <>
      <ListItem disablePadding>
        <ListItemIcon>
          <IconButton onClick={handleClick} sx={{ ml: 0.5 }}>
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </ListItemIcon>

        <ListItemText
          primary={me.name}
          primaryTypographyProps={{ color: "white", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
          secondary={me.user_email}
          secondaryTypographyProps={{ color: "white", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
          title={client.config.jid}
        />
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar /> Profile
        </MenuItem>

        <Divider />

        {statusList.map((s) => (
          <MenuItem key={s.key} onClick={() => setStatus(s.key)}>
            <ListItemIcon>
              <Circle fontSize="small" sx={{ color: s.color }} />
            </ListItemIcon>

            <ListItemText primary={s.label} />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Profile;
