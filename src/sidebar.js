import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Contacts as ContactsIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import Profile from './profile';

const items = [
  {
    route: "contacts",
    label: "Contacts",
    iconComponent: ContactsIcon,
  },
  {
    route: "messages",
    label: "Messages",
    iconComponent: ChatIcon,
  },
]

const SideBar = ({ client, me, setNav, nav, signOut }) => (
  <List sx={{
    display: "flex",
    flexDirection: "column",
    width: "200px",
    minWidth: "200px",
    background: "#091c38",
    color: "white"
  }}>
    <Profile client={client} me={me} />

    {items.map(i => {
      const IconComponent = i.iconComponent;

      return (
        <ListItem key={i.route} disablePadding sx={{ background: nav === i.route ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
          <ListItemButton onClick={() => setNav(i.route)}>
            <ListItemIcon>
              <IconComponent sx={{ color: "white" }} />
            </ListItemIcon>

            <ListItemText>
              {i.label}
            </ListItemText>
          </ListItemButton>
        </ListItem>
      )})}

    <ListItem disablePadding sx={{ mt: "auto" }}>
      <ListItemButton onClick={signOut}>
        <ListItemIcon>
          <LogoutIcon sx={{ color: "white" }} />
        </ListItemIcon>

        <ListItemText>
          Log Out
        </ListItemText>
      </ListItemButton>
    </ListItem>
  </List>
);

export default SideBar;
