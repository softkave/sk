import * as yup from "yup";
import { messages } from "../../models/messages";
import { userConstants } from "../../models/user/constants";
import { RegExPatterns } from "../../models/user/validation";

const name = yup
    .string()
    .trim()
    .max(userConstants.maxNameLength)
    .matches(RegExPatterns.text, messages.provideValidName);

const email = yup.string().trim().email(messages.invalidEmailAddress);

const confirmEmail = yup
    .string()
    .trim()
    .oneOf([yup.ref("email")], messages.emailAddressDoesNotMatch);

const password = yup
    .string()
    .trim()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .matches(RegExPatterns.password, messages.provideValidPasswordWithSymbols);

const confirmPassword = yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], messages.passwordDoesNotMatch);

const nameRequired = name.required(messages.fieldIsRequired);
const emailResuired = email.required(messages.fieldIsRequired);
const passwordRequired = password.required(messages.fieldIsRequired);
const confirmPasswordRequired = confirmPassword.required(
    messages.fieldIsRequired
);
const confirmEmailRequired = confirmEmail.required(messages.fieldIsRequired);

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
