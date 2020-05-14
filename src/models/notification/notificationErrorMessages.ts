const errorMessages = {
  requestDoesNotExist: "Request does not exist",
  sendRequestEmailError: "Error sending request email",
  requestHasBeenSentBefore:
    "Request has been sent before to this email address",
  sendingRequestToAnExistingCollaborator:
    "A user with this email address exists in this organization",
  cannotRevokeRequest:
    "Request does not exist, or has been accepted or declined",
};

const errorFields = {
  notification: "system.notification",
  requestDoesNotExist: "system.notification.requestDoesNotExist",
  sendRequestEmailError: "system.notification.sendRequestEmailError",
  requestHasBeenSentBefore: "system.notification.requestHasBeenSentBefore",
  cannotRevokeRequest: "system.notification.cannotRevokeRequest",
  sendingRequestToAnExistingCollaborator:
    "system.notification.sendingRequestToAnExistingCollaborator",
};

export {
  errorFields as notificationErrorFields,
  errorMessages as notificationErrorMessages,
};
