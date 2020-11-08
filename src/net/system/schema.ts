import { errorFragment } from "../fragments";

export const sendFeedbackMutation = `
    ${errorFragment}
    mutation SendFeedbackMutation (
        $feedback: String!,
        $description: String,
        $notifyEmail: String
    ) {
        system {
            sendFeedback (
                feedback: $feedback,
                description: $description,
                notifyEmail: $notifyEmail
            ) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;
