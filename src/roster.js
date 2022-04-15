import { useState } from "react";

import {
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
} from "@mui/material";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';

import Message from './message';

const AddRoomPrompt = ({ open, close, add }) => {
  const [roomName, setRoomName] = useState("");

  const onAdd = () => {
    add(roomName);
    close();
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add Room</DialogTitle>

      <DialogContent>
        <TextField
          sx={{ width: 400, my: 1 }}
          onChange={(e) => setRoomName(e.target.value)}
          label="Room name"
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
          options={allUsers.map(u => ({
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
  // presence,
  messages,
  roomMessages,
  client,
  allUsers,
  API_BASE,
  MUC_LIGHT_HOSTNAME,
  jwt,
  me,
}) => {
  const [search, setSearch] = useState("");
  const [subNav, setSubNav] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const showAddMenu = Boolean(anchorEl);

  const openAddMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeAddMenu = () => {
    setAnchorEl(null);
  };

  const addContact = (uuid) => {
    const jid = `${uuid}@${client.config.server}`;
    client.subscribe(jid);
  }

  // TODO: this will use the Room API in the future
  const addRoom = async (name) => {
    const uuid = crypto.randomUUID();
    const jid = `${uuid}@${MUC_LIGHT_HOSTNAME}`;
    const res = await client.joinRoom(jid);
    console.log("created room!", res);
    client.configureRoom(jid, { fields: [ { name: 'roomname', value: name } ] });
  }

  // filter by search
  const filteredRoster = roster.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) || r.jid?.includes(search));

  const chatMessages = subNav && messages[subNav.jid]
    ? messages[subNav.jid]
    : [];

  return (
    <>
      <AddContactPrompt
        add={addContact}
        close={() => setShowAddContact(false)}
        open={showAddContact}
        allUsers={allUsers}
      />

      <AddRoomPrompt
        add={addRoom}
        close={() => setShowAddRoom(false)}
        open={showAddRoom}
      />

      <Paper className="scroll-list-container" sx={{ width: 300 }}>
        <Box sx={{ px: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <h2>Contacts</h2>

            <IconButton sx={{ ml: "auto" }} onClick={openAddMenu}>
              <AddIcon fontSize="inherit" />
            </IconButton>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={showAddMenu}
              onClose={closeAddMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => { closeAddMenu(); setShowAddContact(true)}}>Add Contact</MenuItem>
              <MenuItem onClick={() => { closeAddMenu(); setShowAddRoom(true)}}>Add Room</MenuItem>
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

        <List className="scroll-list">
          {filteredRoster.map((u) => (
            <ListItem key={u.jid} disablePadding>
              <ListItemButton onClick={() => setSubNav(u)}>
                <ListItemAvatar>
                  <Avatar>
                    {u.isRoom
                      ? <GroupsIcon />
                      : initials(u)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={u.name}
                  primaryTypographyProps={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                  secondary={u.user?.user_email}
                  secondaryTypographyProps={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                  title={u.jid}
                >
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper className="right-section">
        {subNav && <Message allUsers={allUsers} client={client} user={subNav} messages={chatMessages} API_BASE={API_BASE} jwt={jwt} />}
      </Paper>
    </>
  );
};

function initials(u) {
  return u.name?.split(" ")?.slice(0, 2)?.map(n => n.substr(0, 1));
}

export default Roster;
