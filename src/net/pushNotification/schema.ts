import { errorFragment } from "../fragments";

export const getPushNotificationKeysQuery = `
    ${errorFragment}
    query GetPushNotificationKeysQuery () {
        pushNotification {
            getKeys () {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const pushSubscriptionExistsQuery = `
    ${errorFragment}
    query PushNotificationExistsQuery () {
        pushNotification {
            pushSubscriptionExists () {
                exists
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const subscribePushNotificationMutation = `
    ${errorFragment}
    mutation SubscribePushNotificationMutation (
        $endpoint: String!,
        $auth: SubscribePushSubscriptionKeysInput!
    ) {
        pushNotification {
            subscribePushNotification (endpoint: $endpoint, auth: $auth) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const unsubscribePushNotificationMutation = `
    ${errorFragment}
    mutation UnsubscribePushNotificationMutation () {
        pushNotification {
            unsubscribePushNotification () {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;
