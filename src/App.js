import { useState, useEffect } from "react";
import * as XMPP from "stanza";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import db from "./db";
import "./App.css";
import SideBar from "./sidebar";
import Roster from "./roster";
import Messages from "./messages";

window.db = db;

const API_BASE = "https://saas-api.visionable.one";
const PROTOCOL = "wss";
const PORT = "5443";
const ENDPOINT = "ws-xmpp";

const resource = localStorage.getItem("xmpp-resource") || crypto.randomUUID();
localStorage.setItem("xmpp-resource", resource);

const initXMPP = async (jid, password, hostname) =>
  XMPP.createClient({
    jid,
    password,
    resource,
    transports: {
      websocket: `${PROTOCOL}://${hostname}:${PORT}/${ENDPOINT}`,
    },
  });

const App = ({ signOutAWS, user }) => {
  const [client, setClient] = useState(null);
  const [jwt, setJwt] = useState("");
  const [roster, setRoster] = useState([]);
  const [presence, setPresence] = useState({});
  const [activities, setActivities] = useState({});
  const [incomingInvites, setIncomingInvites] = useState([]);
  const [inviteResponses, setInviteResponses] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [nav, setNav] = useState("contacts");
  const [connected, setConnected] = useState(false);
  const [server] = useState("saas.visionable.one");

  const [serviceName, ...[domain]] = server.split(/\.(.*)/s); // split out the serviceName from the rest of the host
  const xmppHostname = `${serviceName}-msg.${domain}`; // e.g. saas-msg.visionable.one
  const mucHostname = `muclight.${xmppHostname}`; // e.g. muclight.saas-msg.visionable.one

  const signIn = async () => {
    if (client) {
      return; // only sign in once
    }

    if (localStorage.getItem("username") !== user.username) {
      await db.messages.clear();
    }
    localStorage.setItem("username", user.username);

    try {
      const { signInUserSession: session } = user;
      const jwt = session.idToken.jwtToken;
      setJwt(jwt);
      const jid = `${user.username}@${xmppHostname}`;
      const xmpp = await initXMPP(jid, jwt, xmppHostname);

      setClient(xmpp);
      setConnected(true);

      const cognitoUsers = await getAllUsers(jwt);
      const extendedUsers = cognitoUsers.map((u) => ({ ...u, name: userFullName(u) }));
      setAllUsers(extendedUsers);

      window.client = xmpp;

      xmpp.on("session:started", async () => {
        xmpp.updateCaps();
        xmpp.sendPresence({
          legacyCapabilities: xmpp.disco.getCaps() // have to enable this to get PEP notifications
        });
        xmpp.enableKeepAlive();
        xmpp.enableCarbons();

        const roster = (await xmpp.getRoster()).items;
        setRoster(roster);

        // Get all of the messages up until the last one I've seen
        const lastMessage = await db.messages.orderBy("timestamp").last();
        getAllMessages({ client: xmpp, start: lastMessage?.timestamp });

        // get "inbox"
        // xmpp.transport.socket.send(`<iq type='set' id='10bca'>
        //   <inbox xmlns='erlang-solutions.com:xmpp:inbox:0' queryid='b6'>
        //     <x xmlns='jabber:x:data' type='form'>
        //       <field type='hidden' var='FORM_TYPE'><value>erlang-solutions.com:xmpp:inbox:0</value></field>
        //       <field type='list-single' var='order'><value>asc</value></field>
        //       <field type='text-single' var='hidden_read'><value>false</value></field>
        //     </x>
        //     <set xmlns='http://jabber.org/protocol/rsm'>
        //       <max>50</max>
        //     </set>
        //   </inbox>
        // </iq>`);
      });

      xmpp.on("message", (message) => {
        if (message.type === 'meeting-invite') {
          setIncomingInvites((prev) => [...prev, message]);
        } else if (message.type === "chat") {
          const [from] = message.from.split("/");

          db.messages.put({
            id: message.id,
            from,
            to: message.to,
            body: message.body,
            type: message.type,
            group: null,
            timestamp: new Date(),
          }, message.id)
        } else if (message.type === "groupchat") {
          const [room, user] = message.from.split("/");
          console.log("GOT A GROUPCHAT", room, user);
        }
      });

      xmpp.on("message:sent", (message) => {
        if (message.type === 'meeting-invite') {
          // TODO: display something in the chat
        } else if (message.type === "chat") {
          db.messages.put({
            id: message.id,
            from: xmpp.config.jid,
            to: message.to,
            body: message.body,
            type: message.type,
            group: null,
            timestamp: new Date(),
          }, message.id)
        } else if (message.type === "groupchat") {
          // TODO:
        }
      });

      xmpp.on("mam:item", (mam) => {
        // TODO groupchat
        const message = mam.archive?.item?.message;
        const timestamp = mam.archive?.item?.delay?.timestamp;
        if (message.type === 'chat') {
          const { to } = message;
          const [from] = message.from.split("/");
          const fullUser = to?.includes(xmpp.config.jid) ? from : to;
          if (!fullUser) {
            console.log("NO FULL USER", message);
            return;
          }

          db.messages.put({
            id: message.id,
            from,
            to: message.to,
            body: message.body,
            type: message.type,
            group: null,
            timestamp,
          }, message.id)
        }
      });

      xmpp.on("subscribe", (data) => { // if someone subscribes to us..
        xmpp.acceptSubscription(data.from); // auto accept
        xmpp.subscribe(data.from);
      });

      xmpp.on("unsubscribe", () => { // if someone removes me from their roster
        // xmpp.unsubscribe(data.from); // remove them from ours?
      });

      xmpp.on("roster:update", async (data) => { // roster item change
        data.roster.items.forEach((r) => {
          xmpp.searchHistory({ with: r.jid, paging: { before: "" }}); // get the last few messages
        });

        setRoster((await xmpp.getRoster()).items)
      });

      // if someone adds you to a room, auto accept it
      xmpp.on("muc:invite", (data) => {
        client.joinRoom(data.room);
      });

      // created or added to a room
      xmpp.on("muc:available", async () =>
        setRoster((await xmpp.getRoster()).items)
      );

      // no longer in a room
      xmpp.on("muc:unavailable", async () =>
        setRoster((await xmpp.getRoster()).items)
      );

      xmpp.on("presence", (data) => {
        setPresence((prev) => ({ ...prev, [data.from]: data }))
      });

      xmpp.on("activity", (data) => {
        const { jid, activity: { text } } = data;
        console.log("ACTIVITY", jid, text);
        setActivities((prev) => ({ ...prev, [jid]: text }));
      });

      xmpp.on("*", async (type, data) => {
        console.log(type, data);
      });

      // on disconnect, retry
      xmpp.on("disconnected", () => {
        console.log("DISCONNECTED");
        setConnected(false);
        // setTimeout(xmpp.connect, 3000)
      })

      xmpp.on("connected", () => {
        setConnected(true);
      })

      xmpp.connect();

      window.addEventListener('beforeunload', function(event) {
        console.log('window.beforeunload');
        xmpp.disconnect();
      });
    } catch (e) {
      console.error("caught", e);
    }
  };

  useEffect(signIn, [user]);

  // extend the roster with info from the User API, presence, etc.
  const extendedRoster = roster.map(r => {
    const user = allUsers.find(u => r.jid.includes(u.user_id));
    const name = r.name // if the roster item has a name
      ? r.name // use that
      : user // otherwise, if there's a corresponding user from the User API
        ? userFullName(user) // get the name of that
        : r.jid;// otherwise, just show their JID

    // grab all of the resources that we've been given presence for this user
    const statuses = Object.values(presence)
      .filter((u) => u.from.includes(r.jid))
      .filter((u) => u.type !== 'unavailable')
      .map((u) => u.status || 'available');

    const status = statuses.length === 0 // if they have no resources online
      ? 'unavailable' // they're unavailable
      : statuses.some((s) => s === 'in-meeting') // if _any_ resource is in a meeting
        ? 'in-meeting' // show in-meeting
        : statuses.every((s) => s === 'away') // if _all_ of their resources are away
          ? 'away' // show away
          : statuses.every((s) => s === 'available') // if _all_ of their resources are available
            ? 'available' // show available
            : 'available'; // otherwise, if they have other online resources, show available

    return {
      ...r,
      user,
      name,
      status,
      statuses,
      activity: activities[r.jid],
      isRoom: !!r.groups?.[0]?.includes("muc"),
    };
  });
  window.presence = presence;
  window.roster = extendedRoster;
  window.activities = activities;

  console.log('new presence list', presence);
  console.log("extended roster", extendedRoster);

  // find my own user from the User API
  const me = allUsers.find((u) => client.jid.match(u.user_id)) || {};

  const reconnect = async () => {
    console.log("reconnecting");
    // client.config.credentials.password = user.signInUserSession.idToken.jwtToken;
    client.updateConfig({ ...(client.config.credentials), password: user.signInUserSession.idToken.jwtToken });
    client.connect();
  };

  const signOut = async () => {
    client.disconnect();
    setConnected(false);
    setRoster([]);
    setPresence({});
    db.messages.clear();
    signOutAWS();
  };

  const acceptInvite = (message) => {
    setInviteResponses((prev) => ({ ...prev, [message.id]: "accept" }))
    client.sendMessage({ to: message.from, body: message.id, type: 'meeting-invite-accept' });
  };

  const rejectInvite = (message) => {
    setInviteResponses((prev) => ({ ...prev, [message.id]: "reject" }))
    client.sendMessage({ to: message.from, body: message.id, type: 'meeting-invite-reject' });
  };

  /*
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

  const getMUCLightRooms = async () => {
    const res = await client.getDiscoItems(MUC_LIGHT_HOSTNAME);
  }

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
*/

  if (!client) {
    return (
      <div className="App">Loading</div>
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

      <Box className="main">
        {nav === 'contacts'
          ? <Roster
            roster={extendedRoster}
            // presence={presence}
            allUsers={allUsers}
            client={client}
            API_BASE={API_BASE}
            MUC_LIGHT_HOSTNAME={mucHostname}
            jwt={jwt}
            />
          : nav === 'messages'
            ? <Messages
              roster={extendedRoster}
              // presence={presence}
              allUsers={allUsers}
              client={client}
              API_BASE={API_BASE}
              MUC_LIGHT_HOSTNAME={mucHostname}
              jwt={jwt}
              />
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

const getAllUsers = async (jwt) => {
  const res = await fetch(`${API_BASE}/api/user`, { headers: { Authorization: jwt } });
  return res.ok ? res.json() : [];
}

function userFullName(user) {
  return user?.name
  ? user.name
    : user?.user_displayname
      ? user.user_displayname
      : user?.user_firstname
        ? `${user.user_firstname} ${user.user_lastname}`
        : "[No Name]";
}

async function getServiceConfig(hostname) {
  try {
    const res = await fetch(`https://${hostname}/config.json`);
    return await res.json();
  } catch(e) {
    console.log(e);
    alert("Error requesting configuration data for this service");
  }
}

async function getAllMessages({ client, start, after }) {
  const paging = after ? { after } : {};
  const { complete, paging: { last } } = await client.searchHistory({ start, paging });

  if (!complete) {
    getAllMessages({ client, after: last });
  }
}

export default App;
