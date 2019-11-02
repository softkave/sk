import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { notificationConstants } from "../../models/notification/constants";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import { getErrorMessageWithMax } from "../../models/validationErrorMessages";
import withFormikFormWrapper from "../form/withFormikFormWrapper";
import AddCollaboratorForm from "./AddCollaboratorForm";

const validationSchema = yup.object().shape({
  message: yup
    .string()
    .max(notificationConstants.maxAddCollaboratorMessageLength),
  expiresAt: yup.number(),
  requests: yup
    .array()
    .of(
      yup.object().shape({
        email: yup.string().email(userErrorMessages.invalidEmail),
        body: yup
          .string()
          .max(notificationConstants.maxAddCollaboratorMessageLength, () => {
            return getErrorMessageWithMax(
              notificationConstants.maxAddCollaboratorMessageLength,
              "string"
            );
          }),
        expiresAt: yup.number()
      })
    )
    .max(blockConstants.maxAddCollaboratorValuesLength)
    .required()
});

export default withFormikFormWrapper({ validationSchema })(AddCollaboratorForm);
