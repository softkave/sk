import { blockFragment } from "./block";

export const userExistsQuery = `
  query UserExistsQuery (email: String!) {
    user {
      userExists(email: $email) {
        errors {
          field
          message
        }
        userExists
      }
    }
  }
`;

export const updateUserMutation = `
  mutation UpdateUserMutation($data: UpdateUserInput!) {
    user {
      updateUser(user: $user) {
        errors {
          field
          message
        }
      }
    }
  }
`;

export const userLoginFragement = `
  fragment userQueryResult on UserQueryResult {
    errors {
      field
      message
    }
    user {
      name
      email
      customId
      createdAt
      lastNotificationCheckTime
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
  mutation UserForgotPasswordMutation ($email: String!) {
    user {
      forgotPassword {
        errors {
          field
          message
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

export const getCollaborationRequestsQuery = `
  query GetCollaborationRequestsQuery {
    user {
      getCollaborationRequests {
        errors {
          field
          message
        }
        requests {
          customId
          from {
            userId
            name
            blockId
            blockName
            blockType
          }
          createdAt
          body
          readAt
          to {
            email
            userId
          }
          statusHistory {
            status
            date
          }
          sentEmailHistory {
            date
          }
          type
          root
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
  mutation UpdateCollaborationRequestMutation (
    $customId: String!, $data: UpdateCollaborationRequestInput!
  ) {
    user {
      updateCollaborationRequest (customId: $customId, data: $data) {
        errors {
          field
          message
        }
      }
    }
  }
`;

export const respondToCollaborationRequestMutation = `
  ${blockFragment}
  mutation RespondToCollaborationRequestMutation (
    $customId: String!, $response: String!
  ) {
    user {
      respondToCollaborationRequest (customId: $customId, response: $response) {
        errors {
          field
          message
        }
        block {
          ...blockFragment
        }
      }
    }
  }
`;
