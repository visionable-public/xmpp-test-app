// mycontentplugin.ts

import { Agent, JXT } from 'stanza';

export const NS_VISIONABLE_STATUS = 'http://visionable.com/p/status';

export interface VisionableStatusContent {
    // The itemType field is what is used to distinguish pubsub
    // item content types. It MUST be present when exporting,
    // but we're going to mark it as optional to be easier to
    // work with.
    itemType?: typeof NS_VISIONABLE_STATUS;
    status: string;
    timestamp?: BigInt;
}

export default function(client: Agent, stanzas: JXT.Registry) {
      stanzas.define({
        // Inject our definition into all pubsub item content slots.
        // These slots are already registered with `itemType` as the
        // type field.
        aliases: JXT.pubsubItemContentAliases(),
        element: 'status',
        fields: {
            status: JXT.childText(null, 'status'),
            timestamp: JXT.childInteger(null, 'timestamp'),
        },
        namespace: NS_VISIONABLE_STATUS,
        // Specify the `itemType` value for our content.
        type: NS_VISIONABLE_STATUS
    });
    client.disco.addFeature(NS_VISIONABLE_STATUS);
    client.disco.addFeature(NS_PEP_NOTIFY(NS_VISIONABLE_STATUS));
}

const NS_PEP_NOTIFY = (ns: string): string => `${ns}+notify`;

