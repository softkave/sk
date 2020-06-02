import {
  errorFragment,
  notificationFragment,
  userFragment,
} from "../../models/fragments";
import { blockFragment } from "./block";

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

export const getNotificationsQuery = `
  ${errorFragment}
  ${notificationFragment}
  query GetCollaborationRequestsQuery {
    user {
      getCollaborationRequests {
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

export const updateCollaborationRequestMutation = `
  ${errorFragment}
  mutation UpdateCollaborationRequestMutation (
    $customId: String!, $data: UpdateCollaborationRequestInput!
  ) {
    user {
      updateCollaborationRequest (customId: $customId, data: $data) {
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
    $customId: String!, $response: String!
  ) {
    user {
      respondToCollaborationRequest (customId: $customId, response: $response) {
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
