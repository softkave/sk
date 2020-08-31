import UserSessionStorageFuncs from "../../../storage/userSession";
import SessionActions from "../../session/actions";

export const logoutUserOperationAction = () => {
    UserSessionStorageFuncs.deleteUserToken();
    return SessionActions.logoutUser();
};
