import { useState } from "react";
import * as XMPP from "stanza";
import ScrollToBottom from "react-scroll-to-bottom";
import Amplify, { Auth } from "aws-amplify";
import {
  Box,
  Button,
  TextField,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";

import "./App.css";

// AWS Config
const REGION = "us-east-1";
const USER_POOL_ID = "us-east-1_ESYPvGhN3";
const USER_POOL_WEB_CLIENT_ID = "5ai2feek1rgpso497om1kbj4ug";
const API_BASE = "https://saas-api.visionable.one";

// XMPP Config
const HOSTNAME = "saas-msg.visionable.one";// jabber.visionable.io
const PROTOCOL = "wss";
const PORT = "5443"; // 5280
const ENDPOINT = "ws-xmpp"; // ws

Amplify.configure({
  Auth: {
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,
  },
});

const initXMPP = async (jid, password) =>
  XMPP.createClient({
    jid,
    password,
    transports: {
      websocket: `${PROTOCOL}://${HOSTNAME}:${PORT}/${ENDPOINT}`,
    },
  });

const App = () => {
  const [client, setClient] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [password, setPassword] = useState("Green12345!");
  const [jid, setJid] = useState("");
  const [jwt, setJwt] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState("");
  const [to, setTo] = useState("");
  const [online, setOnline] = useState(false);
  const [status, setStatus] = useState("");
  const [roster, setRoster] = useState([]);
  const [rosterPresence, setRosterPresence] = useState({});
  const [rosterNames, setRosterNames] = useState({});
  const [newContact, setNewContact] = useState("");
  const [invitee, setInvitee] = useState("");
  const [incomingInvites, setIncomingInvites] = useState([]);
  const [inviteResponses, setInviteResponses] = useState({});
  const [meetingId, setMeetingId] = useState("");
  const [newName, setNewName] = useState("");
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const signIn = async () => {
    setError("");
    setLoading(true);
    localStorage.setItem("username", username);

    try {
      const { username: uuid, signInUserSession: session } = await Auth.signIn(
        username,
        password
      );
      console.log(session);
      const jwt = session.idToken.jwtToken;
      setJwt(jwt);
      const jid = `${uuid}@${HOSTNAME}`;
      setJid(jid);
      const xmpp = await initXMPP(jid, jwt);

      console.log(jid, jwt)

      setLoading(false);

      setClient(xmpp);

      setUsers(await getAllUsers(jwt));

      window.client = xmpp;

      xmpp.on("session:started", async () => {
        xmpp.sendPresence();
        xmpp.enableKeepAlive();
        xmpp.enableCarbons();
        setOnline(true);

        setRoster((await xmpp.getRoster()).items);
      });

      xmpp.on("message", (message) => {
        log(JSON.stringify(message));

        if (message.type === 'meeting-invite') {
          setIncomingInvites((prev) => [...prev, message]);
        }
      });


      xmpp.on("subscribe", (data) => {
        console.log("on subscribe", data);
        setContactRequests((prev) => prev.concat([data.from]));
      });

      xmpp.on("roster:update", async () =>
        setRoster((await xmpp.getRoster()).items)
      );

      xmpp.on("presence", (data) => {
        const user = data.from.replace(/\/.*$/, "");
        const type = data.type;

        if (type === 'unavailable') {
          setRosterPresence((prev) => ({ ...prev, [user]: type }));
        } else if (data.status) {
          const statusObject = JSON.parse(data.status);
          const { handle, status } = statusObject;
          console.log('handle', handle);
          // TODO setHandle for user

          if (user === jid) {
            setStatus(status || '');
            setNewName(handle || '');
          } else {
            setRosterPresence((prev) => ({ ...prev, [user]: status }));
            setRosterNames((prev) => ({ ...prev, [user]: handle }));
          }
        }
      });

      xmpp.on("available", (data) => {
        const jid = data.from.replace(/\/.*$/, "");
        setRosterPresence((prev) => ({ ...prev, [jid]: 'Available' }));
      });

      xmpp.on("*", async (type, data) => {
        console.log(type, data);
      });

      // TODO on disconnect, retry

      xmpp.connect();
    } catch (e) {
      console.error("caught", e);
      setLoading(false);
      setError(e.message);
    }
  };

  const addContact = () => client.subscribe(newContact);

  const acceptSubscription = (id) => {
    client.acceptSubscription(id);
    client.subscribe(id);
  };
  const denySubscription = (id) => client.denySubscription(id);

  const removeContact = async (jid) => {
    await client.removeRosterItem(jid);
    await client.unsubscribe(jid);
  };

  const signOut = async () => {
    client.disconnect();
    setOnline(false);
    // localStorage.setItem('username', '');
    setLogs("");
    setRoster([]);
    setContactRequests([]);

    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const log = (msg) => {
    console.log(msg, typeof msg);
    const formatted = formatXml(msg.toString(), "  ");
    setLogs((prev) => `${prev}${formatted}\n\n`);
  };

  const clearLog = () => setLogs("");

  const sendMessage = () => {
    client.sendMessage({ to, body: message, type: 'chat' });
    setMessage("");
  };

  const invite = async () => {
    const body = meetingId || await createMeeting();
    client.sendMessage({ to: invitee, body, type: 'meeting-invite' });
  };

  const acceptInvite = (message) => {
    setInviteResponses((prev) => ({ ...prev, [message.id]: "accept" }))
    client.sendMessage({ to: message.from, body: message.id, type: 'meeting-invite-accept' });
  };

  const rejectInvite = (message) => {
    setInviteResponses((prev) => ({ ...prev, [message.id]: "reject" }))
    client.sendMessage({ to: message.from, body: message.id, type: 'meeting-invite-reject' });
  };

  const createMeeting = async () => {
    const url = `${API_BASE}/api/meeting`;
    const mstart = parseInt(new Date().getTime() / 1000);

    const formData = new FormData();
    formData.append("name", "Instant Meeting");
    formData.append("mstart", mstart.toString());
    formData.append("duration", "3600");
    // formData.append("cron", "");

    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: jwt,
      },
      body: formData,
    }).then(res => res.json());
  };

  const sendStatus = () => {
    const richPresence = JSON.stringify({
      status: status,
      handle: newName,
    });
    client.sendPresence({ status: richPresence });
    // client.sendPresence({ status });
  };

  const getMessageArchive = async () => {
    try {
      const history = await client.searchHistory({ with: to });
      console.log('got history', history);
    } catch (e) {
      console.log("Error getting history", e);
    }
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    setError(null);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    setError(null);
  };

  /*
  const changeName = () => {
    // client.publishVCard({ fullName: newName });
  };
*/

  const getVCard = async () => {
    try {
      const card = await client.getVCard(jid);
      console.log("my card", card);
      setNewName(card?.fullName);
    } catch (e) {
      console.error("Error getting vcard", e);
    }
  };

  const uploadFile = (e) => {
    Array.from(e.target.files).forEach(async (f) => {
      const { name, size, type: mediaType } = f; // TODO files with spaces in name fail
      console.log('file', name, size, mediaType);
      const service = await client.getUploadService();
      console.log('service', service);
      const slot = await client.getUploadSlot(service.jid, { name, size, mediaType })
      console.log('slot', slot);
      const { download: downloadUrl, upload: { url: uploadUrl } } = slot;
      console.log('got urls', downloadUrl, uploadUrl);
      const res = await fetch(uploadUrl, {
        method: "PUT",
        body: f,
        headers: { "x-amz-acl": "public-read" },
      });
      console.log('res', res);

      if (to) { // send notification
        client.sendMessage({ to, body: downloadUrl, type: 'file-upload' });
      }

    })
  }

  const joinMUC = (name) => {
  };

  return (
    <div className="App">
      <IncomingInvites
        accept={acceptInvite}
        reject={rejectInvite}
        invites={incomingInvites}
        responses={inviteResponses} />

      <Box component="section">
        {!online ? (
          <>
            <TextField
              label="Username"
              disabled={loading}
              onChange={onChangeUsername}
              value={username}
              error={!!error}
            />
            <TextField
              label="Password"
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && signIn()}
              type="password"
              onChange={onChangePassword}
              value={password}
              error={!!error}
              helperText={error && "Invalid credentials"}
            />
            <Button variant="contained" disabled={loading} onClick={signIn}>
              Sign in
            </Button>
          </>
        ) : (
          <>
            <h3>{jid}</h3>

            <TextField
              size="small"
              label="Name"
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
              onKeyDown={(e) => e.key === "Enter" && sendStatus()}
              InputProps={{
                endAdornment: <Button onClick={sendStatus}>Set</Button>,
              }}
            />

            <TextField
              size="small"
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              onKeyDown={(e) => e.key === "Enter" && sendStatus()}
              InputProps={{
                endAdornment: <Button onClick={sendStatus}>Set</Button>,
              }}
            />

            <h3>Send Contact Request</h3>

            <TextField
              size="small"
              label="To (JID)"
              onChange={(e) => setNewContact(e.target.value)}
              value={newContact}
              onKeyDown={(e) => e.key === "Enter" && addContact()}
              InputProps={{
                endAdornment: <Button onClick={addContact}>Add</Button>,
              }}
            />

            {/* <Autocomplete */}
            {/*   disablePortal */}
            {/*   freeSolo */}
            {/*   value={newContact} */}
            {/*   // inputValue={users.find(u => u.user_id === newContact)?.user_name} */}
            {/*   inputValue={userDisplayName(users.find(u => u.user_id))} */}
            {/*   onChange={(_, u) => u && setNewContact(u.id)} */}
            {/*   options={users.map(u => ({ */}
            {/*       label: userDisplayName(u), */}
            {/*       id: u.user_id, */}
            {/*       // key: u.user_id */}
            {/*     }))} */}
            {/*   renderInput={(params) => <TextField {...params} label="User" />} */}
            {/* /> */}

            {/* New Contact: {newContact} */}

            {/* <Button variant="contained" onClick={addContact}>Add</Button> */}

            <h3>Send a Message</h3>

            <TextField
              size="small"
              label="To (JID)"
              onChange={(e) => setTo(e.target.value)}
              value={to}
            />

            <TextField
              size="small"
              label="Message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              InputProps={{
                endAdornment: <Button onClick={sendMessage}>Send</Button>,
              }}
            />

            <Button variant="contained" component="label">
              Send File
              <input onChange={uploadFile} type="file" hidden />
            </Button>

            <Button variant="contained" onClick={getMessageArchive}>
              Get Message Archive
            </Button>

            <h3>Invite to Meeting</h3>

            <TextField
              size="small"
              label="To (JID)"
              onChange={(e) => setInvitee(e.target.value)}
              value={invitee}
              onKeyDown={(e) => e.key === "Enter" && invite()}
            />

            <TextField
              size="small"
              label="Meeting ID (leave blank to create instant meeting)"
              onChange={(e) => setMeetingId(e.target.value)}
              value={meetingId}
              onKeyDown={(e) => e.key === "Enter" && invite()}
              InputProps={{
                endAdornment: <Button onClick={invite}>Invite</Button>,
              }}
            />

            <Divider />

            <Button variant="contained" onClick={getVCard}>
              Get VCard
            </Button>

            <Divider />

            <Button variant="contained" onClick={signOut}>
              Sign out
            </Button>
          </>
        )}
      </Box>

      {online && (
        <>
          <Box component="section" sx={{ width: "20vw" }}>
            <Roster
              roster={roster}
              rosterPresence={rosterPresence}
              rosterNames={rosterNames}
              contactRequests={contactRequests}
              removeContact={removeContact}
              acceptSubscription={acceptSubscription}
              denySubscription={denySubscription}
            />
          </Box>

          <Box component="section" sx={{ width: "40vw" }}>
            <Logs logs={logs} clearLog={clearLog} />
          </Box>
        </>
      )}
    </div>
  );
};

const Roster = ({
  roster,
  rosterPresence,
  rosterNames,
  contactRequests,
  removeContact,
  acceptSubscription,
  denySubscription,
}) => (
  <>
    <h3>Roster</h3>
    <Divider />
    <ul>
      {roster.map((u) => (
        <li key={u.jid}>
            {rosterNames[u.jid]} ({u.jid}) ({u.subscription}) [{rosterPresence[u.jid]}])
          <Button color="error" onClick={() => removeContact(u.jid)}>
            Remove
          </Button>
        </li>
      ))}
    </ul>

    {contactRequests && (
      <>
        <h3>Contact Requests</h3>
        <Divider />
        <ul>
          {contactRequests.map((u) => (
            <li key={u}>
              {u}
              <Button onClick={() => acceptSubscription(u)}>Accept</Button>
              <Button onClick={() => denySubscription(u)}>Deny</Button>
            </li>
          ))}
        </ul>
      </>
    )}
  </>
);

const Logs = ({ logs, clearLog }) => (
  <>
    <h3>Log</h3>
    <Divider />
    <Paper
      label="Log"
      className="logs"
      sx={{
        textAlign: "left",
        width: "42vw",
        height: "70vh",
        whiteSpace: "pre-wrap",
        overflow: "auto",
      }}
    >
      <ScrollToBottom style={{ width: "500px", height: "500px" }}>
        {logs}
      </ScrollToBottom>
    </Paper>
    <Button variant="contained" onClick={clearLog}>
      Clear Logs
    </Button>
  </>
);

const IncomingInvites = ({ accept, reject, invites, responses }) =>
  invites.filter((m) => !responses[m.id]).map((m) => (
    <Dialog key={m.id} open={true}>
      <DialogTitle>Meeting Invite</DialogTitle>
      <DialogContent>
        <p>Invite ID: {m.id}</p>
        <p>From: {m.from}</p>
        <p>Meeting ID: {m.body}</p>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => reject(m)}>Reject</Button>
        <Button onClick={() => accept(m)}>Accept</Button>
      </DialogActions>
    </Dialog>
  ));

function formatXml(xml, tab) {
  // tab = optional indent value, default is tab (\t)
  var formatted = "",
    indent = "";
  tab = tab || "\t";
  xml.split(/>\s*</).forEach(function(node) {
    if (node.match(/^\/\w/)) indent = indent.substring(tab.length); // decrease indent by one 'tab'
    formatted += indent + "<" + node + ">\r\n";
    if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab; // increase indent
  });
  return formatted.substring(1, formatted.length - 3);
}

const getAllUsers = async (jwt) => {
  const res = await fetch(`${API_BASE}/api/user`, {
    headers: {
      Authorization: jwt,
    },
  })

  return res.ok
    ? res.json()
    : [];
}

const userDisplayName = (u) => `${u.user_firstname} ${u.user_lastname} (${u.user_email})`;

export default App;
