import { errorFragment } from "../fragments";

export const getPushSubscriptionKeysQuery = `
    ${errorFragment}
    query GetPushSubscriptionKeysQuery {
        pushSubscription {
            getPushSubscriptionKeys {
                vapidPublicKey
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const pushSubscriptionExistsQuery = `
    ${errorFragment}
    query PushSubscriptionExistsQuery (
        $endpoint: String!, 
        $keys: SubscribePushSubscriptionKeysInput!
    ) {
        pushSubscription {
            pushSubscriptionExists (
                endpoint: $endpoint, 
                keys: $keys
            ) {
                exists
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const subscribePushSubscriptionMutation = `
    ${errorFragment}
    mutation SubscribePushSubscriptionMutation (
        $endpoint: String!, 
        $keys: SubscribePushSubscriptionKeysInput!
    ) {
        pushSubscription {
            subscribePushSubscription (
                endpoint: $endpoint, 
                keys: $keys
            ) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const unsubscribePushSubscriptionMutation = `
    ${errorFragment}
    mutation UnsubscribePushSubscriptionMutation {
        pushSubscription {
            unsubscribePushSubscription {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;
