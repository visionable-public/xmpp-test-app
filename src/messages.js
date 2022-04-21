import { useState } from 'react';
import {
  Box,
  TextField,
  Paper,
  Stack,
  // Divider,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  // Autocomplete,
} from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";

import GroupsIcon from '@mui/icons-material/Groups';

import Message from "./message";

import db from "./db";

const Messages = ({ client, allUsers, roster, jwt, API_BASE }) => {
  const [search, setSearch] = useState("");
  const [subNav, setSubNav] = useState(null);

  // pull out all of the unique IDs from all of the messages
  const tos = useLiveQuery(() => db.messages.orderBy("to").uniqueKeys()) || [];
  const froms = useLiveQuery(() => db.messages.orderBy("from").uniqueKeys()) || [];
  const jids = tos.concat(froms).filter((v, i, a) => a.indexOf(v) === i); // all unique jids

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

  return (
    <>
      <Paper className="scroll-list-container" sx={{ width: 300 }}>
        <Box sx={{ px: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <h2>Chat</h2>
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
