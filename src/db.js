import Dexie from 'dexie';

const db = new Dexie('visionable-xmpp-test-app');

db.version(1).stores({
  messages: '++id, group, from, to, body, type, timestamp',
});

export default db;
