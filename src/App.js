import { useState, useEffect, useCallback } from "react";
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
import Groups from "./groups";
import Messages from "./messages";
import { Auth } from "aws-amplify";

import IqInbox from './inbox.ts';

window.db = db;

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

const App = ({ signOutAWS, user, hostname }) => {
  const [client, setClient] = useState(null);
  const [jwt, setJwt] = useState("");
  const [roster, setRoster] = useState([]);
  const [presence, setPresence] = useState({});
  const [activities, setActivities] = useState({});
  const [activity, setActivity] = useState("");
  const [incomingInvites, setIncomingInvites] = useState([]);
  const [inviteResponses, setInviteResponses] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [nav, setNav] = useState("contacts");
  const [connected, setConnected] = useState(false);
  const [server] = useState(hostname);
  const [globalLink, setGlobalLink] = useState(null);

  const [serviceName, ...[domain]] = server.split(/\.(.*)/s); // split out the serviceName from the rest of the host
  const xmppHostname = `${serviceName}-msg.${domain}`; // e.g. saas-msg.visionable.one
  const mucHostname = `muclight.${xmppHostname}`; // e.g. muclight.saas-msg.visionable.one

  const apiBase = `https://${serviceName}-api.${domain}`; // e.g. saas-api.visionable.one

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

      xmpp.use(IqInbox);

      setClient(xmpp);
      setConnected(true);

      const cognitoUsers = await getAllUsers(jwt, apiBase);
      const extendedUsers = cognitoUsers.map((u) => ({ ...u, name: userFullName(u) }));
      setAllUsers(extendedUsers);

      const accountInfo = await getAccountInfo(jwt, apiBase);
      setGlobalLink(getGlobalLink(accountInfo));

      window.client = xmpp;

      xmpp.on("session:started", async () => {
        console.log("session:started");
        xmpp.updateCaps();
        xmpp.sendPresence({
          legacyCapabilities: xmpp.disco.getCaps() // have to enable this to get PEP notifications
        });
        xmpp.enableKeepAlive();
        xmpp.enableCarbons();

        const roster = (await xmpp.getRoster()).items;
        setRoster(roster);

        // get "inbox"
        // const res = await xmpp.getInbox();
        // console.log("INBOX RES", res);

        // Get all of the messages up until the last one I've seen
        // const lastMessage = await db.messages.orderBy("timestamp").last();
        // getAllMessages({ client: xmpp, start: lastMessage?.timestamp });

        // Get the last few messages for each of our roster items
        /*
        roster.forEach((r) => {
          if (r.groups.length) {
            xmpp.searchHistory({ to: r.jid, paging: { before: "" }}); // 'to' for MUCs
          } else {
            xmpp.searchHistory({ with: r.jid, paging: { before: "" }});
          }
        });
        */
      });

      xmpp.on("message", (message) => {
        if (message.type === 'meeting-invite') {
          setIncomingInvites((prev) => [...prev, message]);
        } else if (message.type === "chat" || message.type === "groupchat") {
          const [before, after] = message.from.split("/");
          const group = message.type === "chat" ? null : before;
          const from = message.type === "chat" ? before : after;

          db.messages.put({
            id: message.id,
            from,
            to: message.to,
            body: message.body,
            type: message.type,
            group,
            timestamp: new Date(),
          }, message.id)
        }
      });

      xmpp.on("message:sent", (message) => {
        if (message.type === 'meeting-invite') {
          // TODO: display something in the chat
        } else if (message.type === "chat") {
          // TODO: until acked, put a pending status
          db.messages.put({
            id: message.id,
            from: xmpp.config.jid,
            to: message.to,
            body: message.body,
            type: message.type,
            group: null,
            timestamp: new Date(),
          }, message.id)
        }
      });

      xmpp.on("mam:item", (mam) => {
        const message = mam.archive?.item?.message;
        const timestamp = mam.archive?.item?.delay?.timestamp;
        if (message.type === "chat" || message.type === "groupchat") {
          const [before, after] = message.from.split("/");
          const group = message.type === "chat" ? null : before;
          const from = message.type === "chat" ? before : after;

          db.messages.put({
            id: message.id,
            from,
            to: message.to,
            body: message.body,
            type: message.type,
            group,
            timestamp: new Date(),
          }, message.id)
        }
      });

      xmpp.on("inbox", (msg) => {
        const timestamp = msg.result?.forwarded?.delay?.stamp;
        const message = msg.result?.forwarded?.message;
        console.log("inbox message", message)

        if (!message) { return; }
        const { to } = message;

        if (message.type === "chat") {
          const [from] = message.from.split("/");

          db.messages.put({
            id: message.id,
            from,
            to: message.to,
            body: message.body,
            type: message.type,
            group: null,
            timestamp,
          }, message.id)
        } else if (message.type === "groupchat") {

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
        /*
        data.roster.items.forEach((r) => {
          xmpp.searchHistory({ with: r.jid, paging: { before: "" }}); // get the last few messages
        });
        */

        setRoster((await xmpp.getRoster()).items)
      });

      // if someone adds you to a room, auto accept it
      xmpp.on("muc:invite", (data) => {
        setTimeout(() => {
          xmpp.joinRoom(data.room);
        }, 1000);
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
        if (jid === xmpp.config.jid) {
          setActivity(text);
        } else {
          setActivities((prev) => ({ ...prev, [jid]: text }));
        }
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

  const privateGroups = extendedRoster
    .filter(i => !i.isRoom)
    .map(i => i.groups)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(g => ({ name: g, users: extendedRoster.filter(i => i.groups.includes(g)) }));

  // find my own user from the User API
  const me = allUsers.find((u) => client.jid.match(u.user_id)) || {};

  const reconnect = useCallback(async () => {
    // client.config.credentials.password = user.signInUserSession.idToken.jwtToken;
    const password = Auth.currentSession.idToken.jwtToken;
    client.updateConfig({ ...(client.config.credentials), password });
    console.log("reconnecting. password:", password);
    client.connect();
  }, [client]);

  const signOut = async () => {
    db.messages.clear();
    client.disconnect();
    setConnected(false);
    setRoster([]);
    setPresence({});
    localStorage.removeItem("visionable-xmpp-hostname"); // grab this from context
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

  if (!client) {
    return (
      <div className="App">Loading</div>
    );
  }

  return (
    <div className="App">
      <SideBar
        nav={nav}
        setNav={setNav}
        signOut={signOut}
        client={client}
        me={me}
        hostname={hostname}
        activity={activity}
        globalLink={globalLink}
        />

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
            API_BASE={apiBase}
            MUC_LIGHT_HOSTNAME={mucHostname}
            jwt={jwt}
            />
          : nav === 'messages'
            ? <Messages
              roster={extendedRoster}
              // presence={presence}
              allUsers={allUsers}
              client={client}
              API_BASE={apiBase}
              MUC_LIGHT_HOSTNAME={mucHostname}
              jwt={jwt}
              />
            : nav === 'groups'
              ? <Groups
              privateGroups={privateGroups}
              roster={extendedRoster}
              allUsers={allUsers}
              client={client}
              API_BASE={apiBase}
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

const getAllUsers = async (jwt, apiBase) => {
  const res = await fetch(`${apiBase}/api/user`, { headers: { Authorization: jwt } });
  return res.ok ? res.json() : [];
}

function userFullName(user) {
  return user?.name
  ? user.name
    : user?.display_name
      ? user.display_name
      : user?.first_name
        ? `${user.first_name} ${user.last_name}`
        : "[No Name]";
}

async function getAllMessages({ client, start, after }) {
  const paging = after ? { after } : {};
  const { complete, paging: { last } } = await client.searchHistory({ start, paging });

  if (!complete) {
    getAllMessages({ client, after: last });
  }
}

async function getAccountInfo(jwt, apiBase) {
  const res = await fetch(`${apiBase}/api/account/info`, { headers: { Authorization: jwt } });
  return res.ok ? res.json() : {};
}

function getGlobalLink(accountInfo) {
  try {
    return JSON.parse(accountInfo?.account_data || "null")?.globalLink;
  } catch(e) {
    return null;
  }
}

export default App;
