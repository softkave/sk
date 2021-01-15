import { errorFragment } from "../fragments";

export const commentFragment = `
fragment commentFragment on Comment {
}
`;

export const addCommentMutation = `
    ${errorFragment}
    ${commentFragment}
    mutation AddCommentMutation ($comment: AddCommentInput!) {
        comments {
            addComment (comment: $comment) {
                errors {
                    ...errorFragment
                }
                comment {
                    ...commentFragment
                }
            }
        }
    }
`;

export const getTaskCommentsQuery = `
    ${commentFragment}
    ${errorFragment}
    query GetTaskCommentsQuery ($taskId: String!) {
        comments {
            getTaskComments (taskId: $taskId) {
                errors {
                    ...errorFragment
                }
                comments {
                    ...commentFragment
                }
            }
        }
    }
`;
