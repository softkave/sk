import * as yup from "yup";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import blockValidationSchemas from "../block/validation";

export const feedbackFormValidationSchema = yup.object().shape({
  feedback: blockValidationSchemas.name,
  description: blockValidationSchemas.descriptionOptional,
  notifyEmail: yup
    .string()
    .trim()
    .email(userErrorMessages.invalidEmail)
    .nullable(),
});
