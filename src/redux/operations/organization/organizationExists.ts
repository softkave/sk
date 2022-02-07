import OrganizationAPI, {
    IOrganizationExistsEndpointParams,
} from "../../../net/organization/endpoints";
import OrganizationSelectors from "../../organizations/selectors";
import OperationType from "../OperationType";
import { makeAsyncOpWithoutDispatch } from "../utils";

export const organizationExistsOpAction = makeAsyncOpWithoutDispatch(
    "op/organizations/organizationExists",
    OperationType.OrganizationExists,
    async (arg: IOrganizationExistsEndpointParams, thunkAPI, extras) => {
        if (extras.isDemoMode) {
            const name = arg.name.toLowerCase();
            const exists = OrganizationSelectors.filter(
                thunkAPI.getState(),
                (org) => org.name.toLowerCase() === name
            );
            return { exists };
        } else {
            return await OrganizationAPI.organizationExists(arg);
        }
    }
);
