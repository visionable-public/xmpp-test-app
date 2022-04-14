import {
  Box,
  Button,
  Stack,
  TextField,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';

import { blue } from "@mui/material/colors";

const Message = ({ client, user, messages, API_BASE, jwt, allUsers }) => {
  const [message, setMessage] = useState("");
  const [showAddUserToRoom, setShowAddUserToRoom] = useState(false);
  const scrollRef = useRef(null);

  const filteredMessages = messages.filter(m => m.from?.includes(user.jid) || m.to?.includes(user.jid));

  const removeContact = async () => {
    if (user.isRoom) {
      // TODO: bare jid
      await client.setRoomAffiliation(user.jid, client.jid, "none");
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
    console.log("body", body);
    if (body.uuid) {
      client.sendMessage({ to: user.jid, body: body.uuid, type: 'meeting-invite' });
    }
  };

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef?.current?.scrollHeight;
  }, [filteredMessages]);

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <AddUserToRoomPrompt
        client={client}
        room={user}
        open={showAddUserToRoom}
        close={() => setShowAddUserToRoom(false) }
        allUsers={allUsers}
      />

      <Stack direction="row" sx={{ px: 2, background: "white", alignItems: "center" }}>
        <h2>{user.name}</h2>

        <IconButton onClick={removeContact}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>

        {user.isRoom &&
          <IconButton onClick={() => setShowAddUserToRoom(true)}>
            <AddIcon fontSize="inherit" />
          </IconButton>
      }

        <IconButton sx={{ ml: "auto" }} onClick={invite}>
          <VideoCameraFrontIcon fontSize="inherit" />
        </IconButton>
      </Stack>

      <Stack sx={{ background: "#eee", flexGrow: 1, overflow: "auto", px: "10%" }} ref={scrollRef}>
        {filteredMessages.map(m => <Chat key={m.id} message={m} client={client} />)}
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

const Chat = ({ message, client }) => {
  const mine = !message.from || message.from.includes(client.config.jid);

  return (
    <Box
      className={`chat-message ${mine ? "mine" : ""}`}
      sx={{
        background: mine ? blue[700] : "white",
        color: mine ? "white" : "black",
        p: 2,
        mx: 2, my: 1,
        borderRadius: 3,
        marginLeft: mine ? "auto" : 0,
        marginRight: mine ? 0 : "auto",
      }}
    >
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
