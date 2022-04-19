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

import GroupsIcon from '@mui/icons-material/Groups';

import Message from "./message";

const Messages = ({ client, allUsers, roster, messages, jwt, API_BASE }) => {
  const [search, setSearch] = useState("");
  const [subNav, setSubNav] = useState(null);

  console.log("messages", messages);

  const users = Object.entries(messages).map(([jid, ms]) => { // generate the list of message "users"
    const user = allUsers.find((u) => jid.includes(u.user_id)); // user names come from all users
    const name = user?.name || roster.find((r) => r.jid === jid)?.name; // room names will be in your roster

    return {
      jid,
      user,
      name,
      messages: ms,
    };
  });

  const filteredUsers = users.filter((u) => { // filter by search
    const s = search.toLowerCase();
    return u.name?.toLowerCase().includes(s)
      || s.includes(u.name?.toLowerCase())
      || u.user?.user_email?.includes(s)
      || s.includes(u.user?.user_email);
  });

  const chatMessages = subNav && messages[subNav.jid]
    ? messages[subNav.jid]
    : [];

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
        {subNav && <Message allUsers={allUsers} client={client} user={subNav} messages={chatMessages} API_BASE={API_BASE} jwt={jwt} />}
      </Paper>
    </>
  );
};

// TODO put this is allUsers state
function initials(u) {
  return u.name?.split(" ")?.slice(0, 2)?.map(n => n.substr(0, 1));
}

export default Messages;
