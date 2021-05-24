import { blockFragment } from "../block/schema";
import {
    clientFragment,
    errorFragment,
    notificationFragment,
    userFragment,
} from "../fragments";

export const userExistsQuery = `
    ${errorFragment}
    query UserExistsQuery (email: String!) {
        user {
            userExists(email: $email) {
                errors {
                    ...errorFragment
                }
                exists
            }
        }
    }
`;

export const userLoginFragement = `
    ${errorFragment}
    ${userFragment}
    ${clientFragment}
    fragment userQueryResult on UserQueryResult {
        errors {
            ...errorFragment
        }
        user {
            ...userFragment
        }
        client {
            ...clientFragment
        }
        token
    }
`;

export const updateUserMutation = `
    ${userLoginFragement}
    mutation UpdateUserMutation($data: UserUpdateInput!) {
        user {
            updateUser(data: $data) {
                ...userQueryResult
            }
        }
    }
`;

export const userSignupMutation = `
    ${userLoginFragement}
    mutation UserSignupMutation ($user: UserSignupInput!) {
        user {
            signup (user: $user) {
                ...userQueryResult
            }
        }
    }
`;

export const userLoginMutation = `
    ${userLoginFragement}
    mutation UserLoginMutation ($email: String!, $password: String!) {
        user {
            login (email: $email, password: $password) {
                ...userQueryResult
            }
        }
    }
`;

export const forgotPasswordMutation = `
    ${errorFragment}
    mutation UserForgotPasswordMutation ($email: String!) {
        user {
            forgotPassword(email: $email) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const changePasswordMutation = `
    ${userLoginFragement}
    mutation UserChangePasswordMutation (
        $currentPassword: String!, 
        $password: String!
    ) {
        user {
            changePassword (
                currentPassword: $currentPassword, 
                password: $password
            ) {
                ...userQueryResult
            }
        }
    }
`;

export const changePasswordWithTokenMutation = `
    ${userLoginFragement}
    mutation UserChangeWithTokenPasswordMutation (
        $password: String!
    ) {
        user {
            changePasswordWithToken(password: $password) {
                ...userQueryResult
            }
        }
    }
`;

export const getUserNotificationsQuery = `
    ${errorFragment}
    ${notificationFragment}
    query GetUserNotificationsQuery {
        user {
            getUserNotifications {
                errors {
                    ...errorFragment
                }
                requests {
                    ...notificationFragment
                }
            }
        }
    }
`;

export const getUserDataQuery = `
    ${userLoginFragement}
    query GetUserDataQuery {
        user {
            getUserData {
                ...userQueryResult
            }
        }
    }
`;

export const markNotificationReadMutation = `
    ${errorFragment}
    mutation MarkNotificationReadMutation (
        $notificationId: String!, $readAt: String!
    ) {
        user {
            markNotificationRead (notificationId: $notificationId, readAt: $readAt) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const respondToCollaborationRequestMutation = `
    ${blockFragment}
    ${errorFragment}
    mutation RespondToCollaborationRequestMutation (
        $requestId: String!, $response: String!
    ) {
        user {
            respondToCollaborationRequest (requestId: $requestId, response: $response) {
                errors {
                    ...errorFragment
                }
                block {
                    ...blockFragment
                }
                respondedAt
            }
        }
    }
`;

export const updateClientMutation = `
    ${clientFragment}
    ${errorFragment}
    mutation UpdateClientMutation (
        $data: UpdateClientDataInput!
    ) {
        user {
            updateClient (data: $data) {
                errors {
                    ...errorFragment
                }
                client {
                    ...clientFragment
                }
            }
        }
    }
`;
