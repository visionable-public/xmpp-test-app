import { useState, useEffect } from "react";
import * as XMPP from "stanza";
import Amplify, { Auth, Hub } from "aws-amplify";
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
  // Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";

import "./App.css";
import Login from "./login";
import Roster from "./roster";
import SideBar from "./sidebar";

// AWS Config
const REGION = "us-east-1";
const USER_POOL_ID = "us-east-1_ESYPvGhN3";
const USER_POOL_WEB_CLIENT_ID = "5ai2feek1rgpso497om1kbj4ug";
const API_BASE = "https://saas-api.visionable.one";

// XMPP Config
const HOSTNAME = "saas-msg.visionable.one";
const PROTOCOL = "wss";
const PORT = "5443";
const ENDPOINT = "ws-xmpp";
const MUC_HOSTNAME = `muc.${HOSTNAME}`;
const MUC_LIGHT_HOSTNAME = `muclight.${HOSTNAME}`;

Amplify.configure({
  Auth: {
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,
  },
});

const resource = localStorage.getItem("xmpp-resource") || crypto.randomUUID();
localStorage.setItem("xmpp-resource", resource);

const initXMPP = async (jid, password) =>
  XMPP.createClient({
    jid,
    password,
    resource,
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
  const [to, setTo] = useState("");
  const [online, setOnline] = useState(false);
  const [status, setStatus] = useState("");
  const [roster, setRoster] = useState([]);
  const [rosterPresence, setRosterPresence] = useState({});
  // const [rosterNames, setRosterNames] = useState({});
  const [newContact, setNewContact] = useState("");
  const [incomingInvites, setIncomingInvites] = useState([]);
  const [inviteResponses, setInviteResponses] = useState({});
  const [newName, setNewName] = useState("");
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [nav, setNav] = useState("contacts");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const signIn = async () => {
    setError("");
    setLoading(true);
    localStorage.setItem("username", username);

    try {
      const { username: uuid, signInUserSession: session } = await Auth.signIn(
        username,
        password
      );
      window.Auth = Auth;
      console.log(session);
      const jwt = session.idToken.jwtToken;
      setJwt(jwt);
      const jid = `${uuid}@${HOSTNAME}`;
      setJid(jid);
      const xmpp = await initXMPP(jid, jwt);

      console.log(jid, jwt)

      setLoading(false);

      setClient(xmpp);
      setConnected(true);

      setAllUsers(await getAllUsers(jwt));

      window.client = xmpp;

      xmpp.on("session:started", async () => {
        xmpp.sendPresence();
        xmpp.enableKeepAlive();
        xmpp.enableCarbons();
        setOnline(true);

        const roster = (await xmpp.getRoster()).items;
        setRoster(roster);

        // get all messages on start
        // getAllMessages(uuid, jwt);
        roster.forEach((r) => {
          xmpp.searchHistory({ with: r.jid });
        });
      });

      xmpp.on("message", (message) => {
        if (message.type === 'meeting-invite') {
          setIncomingInvites((prev) => [...prev, message]);
        } else if (message.type === "chat") {
          setMessages((prev) => [...prev, message]);
        }
      });

      xmpp.on("message:sent", (message) => {
        if (message.type === 'meeting-invite') {
          // TODO: display something in the chat
        } else if (message.type === "chat") {
          setMessages((prev) => [...prev, message]);
        }
      });

      xmpp.on("mam:item", (mam) => {
        const message = mam.archive?.item?.message;
        console.log("MAM MESSAGE", message);
        setMessages((prev) => [...prev, message]);
      });

      // if someone subscribes to us, automatically subscribe back
      xmpp.on("subscribe", (data) => {
        console.log("on subscribe", data);
        xmpp.subscribe(data.from);
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
          /*
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
*/
        }
      });

      xmpp.on("available", (data) => {
        const jid = data.from.replace(/\/.*$/, "");
        setRosterPresence((prev) => ({ ...prev, [jid]: 'Available' }));
      });

      xmpp.on("*", async (type, data) => {
        console.log(type, data);
      });

      // on disconnect, retry
      xmpp.on("disconnected", () => {
        setConnected(false);
        // setTimeout(xmpp.connect, 3000)
      })

      xmpp.on("connected", () => {
        setConnected(true);
      })

      xmpp.connect();
    } catch (e) {
      console.error("caught", e);
      setLoading(false);
      setError(e.message);
    }
  };

  // TODO: re-authenticate when our JWT refreshes
  useEffect(() => {
    Hub.listen('auth', (data) => {
      console.log("Hub event", data);
      if (data.payload.event === "tokenRefresh") {
        console.log("token refreshed", data);
      }
    });
  }, []);

  // extend the roster with info from the User API
  // TODO: stop doing this and figure out how to use XMPP. PEP?
  const extendedRoster = roster.map(r => {
    const user = allUsers.find(u => r.jid.includes(u.user_id));
    const name = user ? userFullName(user) : r.jid;

    return {
      ...r,
      user,
      name, 
    };
  });

  // find my own user from the User API
  const me = allUsers.find((u) => client.jid.match(u.user_id));

  const addContact = () => client.subscribe(newContact);

  const reconnect = () => client.connect();

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
    setRoster([]);
    setContactRequests([]);

    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const sendMessage = () => {
    client.sendMessage({ to, body: message, type: 'chat' });
    setMessage("");
  };

  const acceptInvite = (message) => {
    setInviteResponses((prev) => ({ ...prev, [message.id]: "accept" }))
    client.sendMessage({ to: message.from, body: message.id, type: 'meeting-invite-accept' });
  };

  const rejectInvite = (message) => {
    setInviteResponses((prev) => ({ ...prev, [message.id]: "reject" }))
    client.sendMessage({ to: message.from, body: message.id, type: 'meeting-invite-reject' });
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

  const changeName = () => {
    client.publishVCard({ fullName: newName });
  };

  const getVCard = async () => {
    try {
      const card = await client.getVCard(jid);
      console.log("my card", card);
      setNewName(card?.fullName);
    } catch (e) {
      console.error("Error getting vcard", e);
    }
  };

  /*
  const getMUCRooms = async () => {
    const res = await client.getDiscoItems(MUC_HOSTNAME);
  }

  const getMUCLightRooms = async () => {
    const res = await client.getDiscoItems(MUC_LIGHT_HOSTNAME);
  }
*/

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

  if (!online) {
    return (
      <div className="App">
        <Login loading={loading} username={username} onChangeUsername={onChangeUsername} password={password} onChangePassword={onChangePassword} error={error} signIn={signIn} />
      </div>
    );
  }

  return (
    <div className="App">
      <SideBar nav={nav} setNav={setNav} signOut={signOut} client={client} me={me} />

      <Snackbar
        onClick={reconnect}
        open={!connected}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        sx={{ cursor: "pointer" }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>Disconnected. Click here to reconnect</Alert>
      </Snackbar>

      <IncomingInvites
        accept={acceptInvite}
        reject={rejectInvite}
        invites={incomingInvites}
        responses={inviteResponses} />

      <Box sx={{ display: "none" }}>
        <>
          <h3>{jid}</h3>

          <TextField size="small" label="Name" onChange={(e) => setNewName(e.target.value)} value={newName} onKeyDown={(e) => e.key === "Enter" && changeName()} InputProps={{ endAdornment: <Button onClick={changeName}>Set</Button> }} />

          <TextField size="small" label="Status" onChange={(e) => setStatus(e.target.value)} value={status} onKeyDown={(e) => e.key === "Enter" && sendStatus()} InputProps={{ endAdornment: <Button onClick={sendStatus}>Set</Button> }} />

          <h3>Send Contact Request</h3>

          <TextField size="small" label="To (JID)" onChange={(e) => setNewContact(e.target.value)} value={newContact} onKeyDown={(e) => e.key === "Enter" && addContact()} InputProps={{ endAdornment: <Button onClick={addContact}>Add</Button> }} />

          <Button variant="contained" component="label"> Send File <input onChange={uploadFile} type="file" hidden /> </Button>

          <Button variant="contained" onClick={getVCard}>Get Own VCard</Button>

          <Divider />

          <Button variant="contained" onClick={signOut}>Sign out</Button>
        </>
      </Box>

      <Box className="main">
        {nav === 'contacts'
          ? <Roster
              roster={extendedRoster}
              rosterPresence={rosterPresence}
              allUsers={allUsers}
              contactRequests={contactRequests}
              removeContact={removeContact}
              acceptSubscription={acceptSubscription}
              denySubscription={denySubscription}
              messages={messages}
              client={client}
              API_BASE={API_BASE}
              MUC_LIGHT_HOSTNAME={MUC_LIGHT_HOSTNAME}
              jwt={jwt}
              me={me}
            />
          : nav === 'messages'
            ? <div>Messages</div>
            : null}
      </Box>
    </div>
  );
};

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

function userFullName(user) {
  return user?.user_displayname
    ? user.user_displayname
    : user?.user_firstname
      ? `${user.user_firstname} ${user.user_lastname}`
      : "[No Name]";
}

// const userDisplayName = (u) => `${userFullName(u)} (${u.user_email})`;

/*
// TODO: CORS
async function getAllMessages(uuid, jwt) {
  try {
    const res = await fetch(`https://${HOSTNAME}/api/messages`, {
      headers: {
        Authorization: `Basic ${btoa(`${uuid}:${jwt}`)}`,
      },
    });
    const json = await res.json();
    console.log(json);
    return json;
  } catch(e) {
    console.log('error fetching messages', e);
  }
}
*/

export default App;
