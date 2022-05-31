import { useState } from "react";

import {
  Badge,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  ListItemText,
  TextField,
  Paper,
  Stack,
  Autocomplete,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab
} from "@mui/material";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';

import Message from './message';
import Contact from './contact';

const AddRoomPrompt = ({ open, close, add }) => {
  const [roomName, setRoomName] = useState("");

  const onAdd = () => {
    add(roomName);
    close();
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add Group</DialogTitle>

      <DialogContent>
        <TextField
          sx={{ width: 400, my: 1 }}
          onChange={(e) => setRoomName(e.target.value)}
          label="Group name"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={onAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

const AddContactPrompt = ({ open, close, add, allUsers }) => {
  const [newContact, setNewContact] = useState("");

  const onAdd = () => {
    add(newContact);
    close();
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add Contact</DialogTitle>

      <DialogContent>
        <Autocomplete
          sx={{ width: 400, my: 1 }}
          onChange={(_, u) => u && setNewContact(u.id)}
          options={allUsers.map((u) => ({
            label: userDisplayName(u),
            id: u.user_id,
          }))}
          renderInput={(params) => <TextField {...params} label="User" />}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={onAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

// TODO use teh name property
const userDisplayName = (u) => `${u.user_firstname} ${u.user_lastname} (${u.user_email})`;

const Roster = ({
  roster,
  client,
  allUsers,
  API_BASE,
  MUC_LIGHT_HOSTNAME,
  jwt,
}) => {
  const [search, setSearch] = useState("");
  const [subNav, setSubNav] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [tab, setTab] = useState(0);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const showAddMenu = Boolean(menuAnchorEl);

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [focusedUser, setFocusedUser] = useState(null);

  const openAddMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const closeAddMenu = () => {
    setMenuAnchorEl(null);
  };

  const openContact = (event, user) => {
    event.stopPropagation();
    setFocusedUser(user);
    setProfileAnchorEl(event.currentTarget);
  }

  const addContact = (uuid) => {
    const jid = `${uuid}@${client.config.server}`;
    client.subscribe(jid);
  }

  // TODO: this will use the Room API in the future
  const addRoom = async (name) => {
    const uuid = crypto.randomUUID();
    const jid = `${uuid}@${MUC_LIGHT_HOSTNAME}`;
    const res = await client.joinRoom(jid);
    client.configureRoom(jid, { fields: [ { name: 'roomname', value: name } ] });
  }

  // filter by search
  const filteredRoster = roster.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) || r.jid?.includes(search))
  .filter(r => (tab === 0 && !r.isRoom) || (tab === 1 && r.isRoom));

  const allOtherUsers = allUsers.filter((u) => !client.config.jid.includes(u.user_id));

  return (
    <>
      <AddContactPrompt
        add={addContact}
        close={() => setShowAddContact(false)}
        open={showAddContact}
        allUsers={allOtherUsers}
      />

      <AddRoomPrompt
        add={addRoom}
        close={() => setShowAddRoom(false)}
        open={showAddRoom}
      />

      {profileAnchorEl && focusedUser &&
        <Contact user={focusedUser} anchorEl={profileAnchorEl} onClose={() => setProfileAnchorEl(null)}/>}

      <Paper className="scroll-list-container" sx={{ width: 300 }}>
        <Box sx={{ px: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <h2>Contacts</h2>

            <IconButton sx={{ ml: "auto" }} onClick={openAddMenu}>
              <AddIcon fontSize="inherit" />
            </IconButton>

            <Menu
              id="basic-menu"
              anchorEl={menuAnchorEl}
              open={showAddMenu}
              onClose={closeAddMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => { closeAddMenu(); setShowAddContact(true)}}>Add Contact</MenuItem>
              <MenuItem onClick={() => { closeAddMenu(); setShowAddRoom(true)}}>Add Group</MenuItem>
            </Menu>
          </Stack>

          <TextField
            type="search"
            label="Search"
            variant="filled"
            size="small"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, idx) => setTab(idx)} aria-label="basic tabs example">
            <Tab label="Contacts" index={0} />
            <Tab label="Groups" index={1} />
          </Tabs>
        </Box>

        <List className="scroll-list">
          {filteredRoster.map((u) => {
            const status = u.isRoom ? '' : u.status;
            const color = {
              available: "#51b397",
              away: "#f0a73e",
              unavailable: "gray",
              "in-meeting": "#ea3323",
            }[status] || "gray";

            return (
              <ListItem key={u.jid} disablePadding>
                <ListItemButton onClick={(e) => setSubNav(u)}>
                  <ListItemAvatar>
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
                      invisible={u.isRoom}
                      variant="dot"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar onClick={(e) => openContact(e, u)}>
                        {u.isRoom
                          ? <GroupsIcon />
                          : initials(u)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={<>{u.name} {!u.isRoom ? <span style={{ color: "#888" }}>- {u.user?.user_email}</span> : ''}</>}
                    primaryTypographyProps={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                    secondary={u.activity ? u.activity : ""}
                    secondaryTypographyProps={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                    />
                </ListItemButton>
              </ListItem>
            )})}
        </List>
      </Paper>

      <Paper className="right-section">
        {subNav && <Message allUsers={allUsers} client={client} user={subNav} API_BASE={API_BASE} jwt={jwt} />}
      </Paper>
    </>
  );
};

// TODO put this is allUsers state
function initials(u) {
  return u.name?.split(" ")?.slice(0, 2)?.map(n => n.substr(0, 1));
}

export default Roster;
