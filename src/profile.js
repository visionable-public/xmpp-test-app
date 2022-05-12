import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Circle from '@mui/icons-material/Circle';

import SettingsDialog from './settings';

const Profile = ({ client, me, signOut }) => {
  const [, setStatus] = useState("available");
  const [anchorEl, setAnchorEl] = useState(null);
  // const [newActivity, setNewActivity] = useState("");
  const [activity, setActivity] = useState(""); // TODO: get last activity
  const [showSettings, setShowSettings] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeStatus = (status) => {
    setStatus(status);
    client.sendPresence({ status });
  };

  const activityPrompt = () => { // TODO: use mui
    const text = prompt("Enter a custom message");
    // setNewActivity(text);
    // sendActivity();
    client.publishActivity({ text })
    setActivity(text);
  }

  /*
  const sendActivity = () => {
    client.publishActivity({ text: activity })
    setActivity(newActivity);
  }
*/

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
        <ListItemButton onClick={handleClick} sx={{ mx: 1 }}>
          <ListItemAvatar>
            <Avatar>{initials(me)}</Avatar>
          </ListItemAvatar>
        </ListItemButton>

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
      >
        {statusList.map((s) => (
          <MenuItem key={s.key} onClick={() => changeStatus(s.key)}>
            <ListItemIcon>
              <Circle fontSize="small" sx={{ color: s.color }} />
            </ListItemIcon>

            <ListItemText primary={s.label} />
          </MenuItem>
        ))}

        <MenuItem onClick={activityPrompt}>
          {activity || <i>Custom message</i>}
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => {setShowSettings(true)}}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem onClick={signOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <SettingsDialog open={showSettings} onClose={() => setShowSettings(false)} client={client} me={me} />
    </>
  );
};

// TODO put this is allUsers state
function initials(u) {
  return u.name?.split(" ")?.slice(0, 2)?.map(n => n.substr(0, 1));
}

export default Profile;
