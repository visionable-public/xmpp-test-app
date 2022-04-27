import { Agent, JXT } from 'stanza';
import { IQ, ReceivedMessage } from 'stanza/protocol';

// 1. Declare our new custom stanza extension type
export interface InboxMessage extends ReceivedMessage {
  result?: InboxResult;
}

export interface InboxResult {
  forwarded?: InboxMessage;
}

export interface InboxMessage {
  message?: string;
}

// 2. Begin injecting our plugin's type information into StanzaJS.
declare module 'stanza' {

    // 3. Declare a new method for the StanzaJS agent
    export interface Agent {
        getInbox(): Promise<IQ>
    }

    // 4. Declare our event types. (Event names are the fields in AgentEvents.)
    export interface AgentEvents {
      inbox: InboxMessage;
    }

    // 5. Stanza definitions MUST be placed in the Stanzas namespace
    namespace Stanzas {

        // 6. Attach our new definition to Message stanzas
        export interface Message {
            result?: InboxResult;
        }
    }
}


// 7. Create a plugin function
export default function (client: Agent, stanzas: JXT.Registry) {

    // 8. Create and register our custom stanza definition
    stanzas.define({
        element: 'result',
        fields: {
            unread: JXT.attribute('unread'),
            queryid: JXT.attribute('queryid'),
        },
        namespace: 'erlang-solutions.com:xmpp:inbox:0',
        path: 'message.result'
    });

    stanzas.define({
        element: 'forwarded',
        fields: {
            unread: JXT.attribute('unread')
        },
        namespace: 'urn:xmpp:forward:0',
        path: 'message.result.forwarded'
    });

    stanzas.define({
        element: 'inbox',
        fields: {
            result: JXT.text()
        },
        namespace: 'erlang-solutions.com:xmpp:inbox:0',
        path: 'iq.inbox'
    });

    // 9. Add API to the StanzaJS agent for sending
    client.getInbox = () => {
        return client.sendIQ({
            type: 'set',
            inbox: "test",
        });
    };

    // 10. Listen for incoming inbox data and emit our own event
    client.on('message', msg => {
        if (msg.result) {
            client.emit('inbox', msg);
        }
    });
};
