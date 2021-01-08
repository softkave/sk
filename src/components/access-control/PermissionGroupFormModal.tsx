import withDrawer, { WithDrawerType } from "../withDrawer";
import PermissionGroupFormContainer from "./PermissionGroupFormContainer";

export default withDrawer(PermissionGroupFormContainer, {
    type: WithDrawerType.Modal,
});
