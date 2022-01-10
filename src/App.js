import { useState } from "react";
import * as XMPP from "stanza";
import ScrollToBottom from "react-scroll-to-bottom";
import Amplify, { Auth } from "aws-amplify";
import {
  Box,
  ButtonGroup,
  Button,
  TextField,
  Paper,
  Divider,
} from "@mui/material";

import "./App.css";

// Cognito Config
const REGION = "us-east-1";
const USER_POOL_ID = "us-east-1_Lr7XLDbJq";
const USER_POOL_WEB_CLIENT_ID = "6ln0t56mg9gpo6b20t1g7pg4j";

// XMPP Config
const HOSTNAME = "saas-msg.visionable.one"; // jabber.visionable.io
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
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState("Green12345!");
  const [jid, setJid] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState("");
  const [to, setTo] = useState("");
  const [online, setOnline] = useState(false);
  const [status, setStatus] = useState("");
  const [roster, setRoster] = useState([]);
  const [newContact, setNewContact] = useState("");
  const [newName, setNewName] = useState("");
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const jid = `${uuid}@${HOSTNAME}`;
      setJid(jid);
      const xmpp = await initXMPP(jid, jwt);

      setLoading(false);

      setClient(xmpp);

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
      });

      xmpp.on("subscribe", (data) => {
        console.log("on subscribe", data);
        setContactRequests((prev) => prev.concat([data.from]));
      });

      xmpp.on("roster:update", async () =>
        setRoster((await xmpp.getRoster()).items)
      );

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
    client.sendMessage({ to, body: message });
    setMessage("");
  };

  const sendStatus = () => client.sendPresence({ status });

  const getMessageArchive = () => {};

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    setError(null);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    setError(null);
  };

  const changeName = () => client.publishVCard({ fullName: newName });

  const getVCard = async () => {
    try {
      const card = await client.getVCard(jid);
      console.log("my card", card);
      setNewName(card?.fullName);
    } catch (e) {
      console.error("Error getting vcard", e);
    }
  };

  return (
    <div className="App">
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

            <Divider />

            <TextField
              size="small"
              label="Change Name"
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
              onKeyDown={(e) => e.key === "Enter" && changeName()}
              InputProps={{
                endAdornment: <Button onClick={changeName}>Set</Button>,
              }}
            />

            <Divider />

            <TextField
              size="small"
              label="To"
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

            <Divider />

            <TextField
              size="small"
              label="Add Contact"
              onChange={(e) => setNewContact(e.target.value)}
              value={newContact}
              onKeyDown={(e) => e.key === "Enter" && addContact()}
              InputProps={{
                endAdornment: <Button onClick={addContact}>Add</Button>,
              }}
            />

            <Divider />

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

            <Divider />

            <Button variant="contained" onClick={getMessageArchive}>
              Get Message Archive
            </Button>
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
          {u.jid} ({u.subscription})
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

export default App;
