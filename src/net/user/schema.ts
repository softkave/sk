import { blockFragment } from "../block/schema";
import {
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
        userExists
      }
    }
  }
`;

export const updateUserMutation = `
  ${errorFragment}
  mutation UpdateUserMutation($data: UpdateUserInput!) {
    user {
      updateUser(user: $user) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const userLoginFragement = `
  ${errorFragment}
  ${userFragment}
  fragment userQueryResult on UserQueryResult {
    clientId
    errors {
      ...errorFragment
    }
    user {
      ...userFragment
    }
    token
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
  mutation UserChangePasswordMutation ($password: String!) {
    user {
      changePassword (password: $password) {
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
        notifications {
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
      }
    }
  }
`;
