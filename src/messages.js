import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Autocomplete,
} from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";

import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';

import Message from "./message";

import db from "./db";

const AddChatPrompt = ({ open, close, add, allUsers }) => {
  const [newContact, setNewContact] = useState("");

  const onAdd = () => {
    add(newContact);
    close();
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Find a User</DialogTitle>

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

const Messages = ({ client, allUsers, roster, jwt, API_BASE }) => {
  const [search, setSearch] = useState("");
  const [subNav, setSubNav] = useState(null);
  const [showAddChat, setShowAddChat] = useState(false);

  // pull out all of the unique IDs from all of the messages
  const tos = useLiveQuery(() => db.messages.orderBy("to").uniqueKeys()) || [];
  const froms = useLiveQuery(() => db.messages.orderBy("from").uniqueKeys()) || [];
  const jids = tos.concat(froms)
  .filter((v, i, a) => a.indexOf(v) === i) // all unique jids
  .filter((jid) => jid !== client.config.jid); // that aren't you

  const users = jids?.map(jid => { // add names
    const user = allUsers.find((u) => jid.includes(u.user_id));
    const name = user?.name // user names come from all users
      || roster.find((r) => r.jid === jid)?.name // room names will be in your roster
      || jid;

    return { jid, user, name };
  });

  const filteredUsers = users?.filter((u) => { // filter by search
    const s = search.toLowerCase();
    return u.name?.toLowerCase().includes(s)
      || s.includes(u.name?.toLowerCase())
      || u.user?.user_email?.includes(s)
      || s.includes(u.user?.user_email);
  });

  const addChat = (uuid) => {
    console.log("addChat", uuid);
    const jid = `${uuid}@${client.config.server}`;
    console.log("jid", jid);
    // TODO
  };

  return (
    <>
      <AddChatPrompt
        add={addChat}
        close={() => setShowAddChat(false)}
        open={showAddChat}
        allUsers={allUsers}
      />

      <Paper className="scroll-list-container" sx={{ width: 300 }}>
        <Box sx={{ px: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <h2>Chat</h2>
            {/* <IconButton sx={{ ml: "auto" }} onClick={() => setShowAddChat(true)}> */}
            {/*   <AddIcon fontSize="inherit" /> */}
            {/* </IconButton> */}
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
          {filteredUsers.map((u) => (
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
                />
              </ListItemButton>
            </ListItem>
          ))}
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

export default Messages;
