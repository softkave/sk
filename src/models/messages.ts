export default class ErrorMessages {
    public static EMAIL_ADDRESS_IS_REQUIRED = "Email address is required";
    public static FIELD_IS_REQUIRED = "Field is required";
    public static AN_ERROR_OCCURRED = "An error occurred";
}

export const messages = {
    // general
    unsupportedFeatureTitle: "Unsupported Feature",
    unsupportedFeatureMessage:
        "Your browser does not support this feature. Try updating your browser.",

    // error
    anErrorOccurred: "An error occurred",

    // form
    fieldIsRequired: "Enter a value, this field is required",

    // user error messages
    emailAddressRequired: "Please enter a valid email address",
    emailAddressDoesNotMatch: "The email addresses you entered do not match",
    passwordDoesNotMatch: "The passwords you entered do not match",
    provideValidName: "Please enter only alphanumeric characters",
    provideValidPasswordWithoutSymbols:
        "Enter only alpanumeric characters with any of the allowed symbols",
    provideValidPasswordWithSymbols:
        "Enter only alpanumeric characters with any of the allowed symbols [!()?_`~#$^&*+=]",
    validPasswordSymbols: "!()?_`~#$^&*+=",
    passwordMinCharacters: "Please enter a minimum of 7 characters",
    userAccessRevoked: "Hi, sorry but your access has been revoked",
    invalidCredentials:
        "You've provided an invalid credential, maybe try loggin in again",
    credentialsExpired: "Your credentials have expired, try logging in again",
    emailAddressNotAvailable: "The email address you entered is not available",
    invalidEmailAddress: "The value you entered is not a valid email address",
    permissionDenied:
        "Hi, sorry, we tried, but you don't have the necessary permissions to do what you've requested",
    loginAgain: "Please can you login again, thank you!",
    userDoesNotExist: "Sorry, but the user does not exist",
    collaboratorDoesNotExist: "Sorry, but the collaborator does not exist",
    invalidLoginCredentials:
        "You've entered an incorrect email address or password",
    apiEmailAddressUnavailableErrorMessage:
        "This email address is not available",

    // user form labels
    nameLabel: "Your Name",
    emailAddressLabel: "Your Email Address",
    changeEmailLabel: "Change Your Email Address",
    confirmEmailAddressLabel: "Confirm Your Email Address",
    passwordLabel: "Your Password",
    newPasswordLabel: "New Password",
    currentPasswordLabel: "Current Password",
    confirmPasswordLabel: "Confirm Your Password",
    colorLabel: "Select Your Preferred Color Avatar",

    // user form placeholders
    namePlaceHolder: "Enter your first name and last name",
    emailAddressPlaceholder: "Enter your email address",
    confirmEmailAddressPlaceholder: "Re-enter your email address",
    passwordPlaceholder: "Enter your new password",
    currentPasswordPlaceholder: "Enter your current password",
    confirmPasswordPlaceholder: "Re-enter your new password",
};
