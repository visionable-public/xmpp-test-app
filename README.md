# Visionable XMPP Test App

## Installation & Dev

`yarn`

`yarn start`

## Tech

- [MongooseIM](https://github.com/esl/MongooseIM) - XMPP Server
- [Stanza.io](https://stanza.io) - XMPP JavaScript Library
- [Dexie](https://dexie.org) - IndexedDB Library
- [AWS Amplify](https://docs.amplify.aws/lib/q/platform/js/) - Authentication & Authorization
- [React](https://reactjs.org/) - JavaScript UI

## Decisions

### Offline Storage

We store all chat history in an IndexedDB database. When we log in, we ask XMPP for the [Messages Archive](https://xmpp.org/extensions/xep-0313.html) starting from the latest message we have cached.

If a user Signs Out, we clear the database. If a _different_ user logs in, we clear the database.

### Presence

We allow you to log in to multiple devices at once, which means our contact list items represent potentially multiple _resources_ (devices). We keep track of Presence information for each online resource, and determine what status to display.
