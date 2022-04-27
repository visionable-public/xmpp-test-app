import {
  Box,
  Button,
  Stack,
  TextField,
  IconButton,
  Autocomplete,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { blue } from "@mui/material/colors";

import { useLiveQuery } from "dexie-react-hooks";
import db from './db';

const Message = ({ client, user, API_BASE, jwt, allUsers }) => {
  console.log("Message component", user)
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [showAddUserToRoom, setShowAddUserToRoom] = useState(false);
  const scrollRef = useRef(null);

  const [roomListAnchorEl, setRoomListAnchorEl] = useState(null);
  const showRoomList = Boolean(roomListAnchorEl);

  const messages = useLiveQuery(() => 
    user.isRoom
      ? db.messages.where("group").equals(user.jid).sortBy("timestamp")
      : db.messages.where("from").equals(user.jid).or("to").equals(user.jid).sortBy("timestamp"),
    [user], []); //  || [];

  const extendedMessages = messages.map((message) => { // add user info
    const user = allUsers.find((u) => message.from?.includes(u.user_id));
    const name = user?.name || message.from;

    return { ...message, user, name };
  });

  const removeContact = async () => {
    if (user.isRoom) {
      await client.setRoomAffiliation(user.jid, client.config.jid, "none");
      await client.leaveRoom(user.jid);
    } else {
      await client.removeRosterItem(user.jid);
      await client.unsubscribe(user.jid);
    }
  };

  const sendMessage = () => {
    if (!message) {
      return;
    }

    const type = user.isRoom ? 'groupchat' : 'chat';
    client.sendMessage({ to: user.jid, body: message, type });
    setMessage("");
  };

  const invite = async () => {
    const body = await createMeeting(API_BASE, jwt);
    if (body.uuid) {
      client.sendMessage({ to: user.jid, body: body.uuid, type: 'meeting-invite' });
    }
  };

  const memberList = async (event) => {
    const res = await client.getRoomMembers(user.jid);

    setMembers(res.muc.users.map((m) => ({
      ...m,
      name: allUsers.find((u) => m.jid.includes(u.user_id))?.name,
    })));

    setRoomListAnchorEl(event.target);
  };

  const closeRoomList = () => setRoomListAnchorEl(null);
  const openAddUser = () => {
    closeRoomList();
    setShowAddUserToRoom(true);
  }

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef?.current?.scrollHeight;
  }, [messages]);

  const allOtherUsers = allUsers.filter((u) => !client.config.jid.includes(u.user_id));

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <AddUserToRoomPrompt
        client={client}
        room={user}
        open={showAddUserToRoom}
        close={() => setShowAddUserToRoom(false) }
        allUsers={allOtherUsers}
      />

      <Stack direction="row" sx={{ px: 2, background: "white", alignItems: "center" }}>
        <h2>{user.name}</h2>

        <IconButton sx={{ ml: "auto" }} onClick={removeContact}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>

        {user.isRoom && <>
          <IconButton onClick={memberList}>
            <GroupAddIcon fontSize="inherit" />
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={roomListAnchorEl}
            open={showRoomList}
            onClose={closeRoomList}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {members.map((m) => (
              <MenuItem key={m.jid}>{m.name}</MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={openAddUser}>Add</MenuItem>
          </Menu>
        </>}

        <IconButton onClick={invite}>
          <VideoCameraFrontIcon fontSize="inherit" />
        </IconButton>
      </Stack>

      <Stack sx={{ background: "#eee", flexGrow: 1, overflow: "auto", px: "10%" }} ref={scrollRef}>
        {extendedMessages.map(m => <Chat key={m.id} message={m} client={client} isRoom={user.isRoom} />)}
      </Stack>

      <Stack direction="row" sx={{ p: 1 }}>
        <TextField
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          sx={{ flexGrow: 1 }}
          placeholder="Send a message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage() }
          InputProps={{ endAdornment: <Button onClick={sendMessage}>Send</Button> }}
        />

        {/* <Button variant="primary" onClick={sendMessage}>Send</Button> */}
      </Stack>
    </Stack>
  );
};

const Chat = ({ message, client, isRoom }) => {
  const mine = !message.from || message.from.includes(client.config.jid);

  // if we're in a room, grab the user's jid from the `from` field
  // if it's a direct chat, grab just the bare JID
  // const jid = message.from?.split("/")[isRoom ? 1 : 0];

  return (
    <Box
      className={`chat-message ${mine ? "mine" : ""}`}
      sx={{
        background: mine ? blue[700] : "white",
        color: mine ? "white" : "black",
        p: 1.5,
        mx: 2, my: 1,
        borderRadius: 2,
        marginLeft: mine ? "auto" : 0,
        marginRight: mine ? 0 : "auto",
      }}
    >
      <span style={{ fontSize: "0.8em" }}>
        <b>{message.name}</b>
        <span style={{ marginLeft: "1em", color: mine ? "#eee" : "#666" }}>{message.timestamp?.toLocaleString()}</span>
      </span>
      <br />
      {message.body}
    </Box>
  );
}

async function createMeeting(API_BASE, jwt) {
  const url = `${API_BASE}/api/meeting`;
  const mstart = parseInt(new Date().getTime() / 1000);

  const formData = new FormData();
  formData.append("name", "Instant Meeting");
  formData.append("mstart", mstart.toString());
  formData.append("duration", "3600");

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: jwt,
    },
    body: formData,
  }).then(res => res.json());
};

const AddUserToRoomPrompt = ({ open, close, allUsers, client, room }) => {
  const [user, setUser] = useState("");

  const onAdd = () => {
    const jid = `${user}@saas-msg.visionable.one`; // TODO: use constant
    client.setRoomAffiliation(room.jid, jid, "member")
    close();
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add User to Room</DialogTitle>

      <DialogContent>
        <Autocomplete
          sx={{ width: 400, my: 1 }}
          onChange={(_, u) => u && setUser(u.id)}
          options={allUsers.map(u => ({
            label: `${u.name} (${u.user_email})`,
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
}

export default Message;
