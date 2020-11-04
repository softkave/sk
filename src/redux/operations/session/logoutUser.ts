import UserSessionStorageFuncs from "../../../storage/userSession";
import SessionActions from "../../session/actions";

export const logoutUserOpAction = () => {
    UserSessionStorageFuncs.deleteUserToken();
    return SessionActions.logoutUser();
};
