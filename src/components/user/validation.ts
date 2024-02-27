import * as yup from "yup";
import { appMessages } from "../../models/messages";
import { userConstants } from "../../models/user/constants";
import { RegExPatterns } from "../../models/user/validation";

const name = yup
  .string()
  .trim()
  .max(userConstants.maxNameLength)
  .matches(RegExPatterns.text, appMessages.provideValidName);

const email = yup.string().trim().email(appMessages.invalidEmailAddress);

const confirmEmail = yup
  .string()
  .trim()
  .oneOf([yup.ref("email")], appMessages.emailAddressDoesNotMatch);

const password = yup
  .string()
  .trim()
  .min(userConstants.minPasswordLength)
  .max(userConstants.maxPasswordLength)
  .matches(RegExPatterns.password, appMessages.provideValidPasswordWithSymbols);

const confirmPassword = yup
  .string()
  .trim()
  .oneOf([yup.ref("password")], appMessages.passwordDoesNotMatch);

const nameRequired = name.required(appMessages.fieldIsRequired);
const emailResuired = email.required(appMessages.fieldIsRequired);
const passwordRequired = password.required(appMessages.fieldIsRequired);
const confirmPasswordRequired = confirmPassword.required(appMessages.fieldIsRequired);
const confirmEmailRequired = confirmEmail.required(appMessages.fieldIsRequired);

export const userValidationSchemas = {
  name,
  email,
  confirmEmail,
  password,
  confirmPassword,
  nameRequired,
  emailResuired,
  passwordRequired,
  confirmEmailRequired,
  confirmPasswordRequired,
};
