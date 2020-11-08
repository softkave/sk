import * as yup from "yup";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import blockValidationSchemas from "../block/validation";

export const feedbackFormValidationSchema = yup.object().shape({
    name: blockValidationSchemas.name,
    description: blockValidationSchemas.descriptionOptional,
    notifyUserEmail: yup.string().email(userErrorMessages.invalidEmail),
});
