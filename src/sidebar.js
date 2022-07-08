import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Contacts as ContactsIcon,
  Groups as GroupsIcon,
  Chat as ChatIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

import Profile from './profile';

const items = [
  {
    route: "contacts",
    label: "Contacts",
    iconComponent: ContactsIcon,
  },
  {
    route: "groups",
    label: "Groups",
    iconComponent: GroupsIcon,
  },
  {
    route: "messages",
    label: "Messages",
    iconComponent: ChatIcon,
  },
]

const SideBar = ({ client, me, setNav, nav, signOut, hostname, activity, globalLink}) => (
  <List sx={{
    display: "flex",
    flexDirection: "column",
    width: "240px",
    minWidth: "240px",
    background: "#091c38",
    color: "white"
  }}>
    <Profile client={client} me={me} signOut={signOut} activity={activity} />

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

    {globalLink && (
      <ListItem disablePadding>
        <ListItemButton onClick={() => window.open(globalLink)}>
          <ListItemIcon>
            <LinkIcon sx={{ color: "white" }} />
          </ListItemIcon>

          <ListItemText>Global Link</ListItemText>
        </ListItemButton>
      </ListItem>
    )}

    <ListItem sx={{ mt: "auto", justifyContent: "center", color: "#bbb" }}>
      {hostname}
    </ListItem>
  </List>
);

export default SideBar;
