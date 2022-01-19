import path from "path";
import React from "react";
import { URLSearchParams } from "url";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import AppHomeContainer from "../components/appHome/AppHomeContainer";
import { isPath0App, paths } from "../components/appHome/path";
import StyledContainer from "../components/styled/Container";
import seedDemoData from "../models/seedDemoData";
import SocketAPI from "../net/socket/socket";
import BlockActions from "../redux/blocks/actions";
import KeyValueActions from "../redux/key-value/actions";
import KeyValueSelectors from "../redux/key-value/selectors";
import { KeyValueKeys } from "../redux/key-value/types";
import NotificationActions from "../redux/notifications/actions";
import OperationActions from "../redux/operations/actions";
import { initializeAppSessionOpAction } from "../redux/operations/session/initializeAppSession";
import RoomActions from "../redux/rooms/actions";
import SessionActions from "../redux/session/actions";
import SessionSelectors from "../redux/session/selectors";
import { SessionType } from "../redux/session/types";
import { AppDispatch, IAppState } from "../redux/types";
import UserActions from "../redux/users/actions";
import { getNewId } from "../utils/utils";
import AppVisibility from "./AppVisibility";
import ExistentialRenderer from "./ExistentialRenderer";
import Routes from "./Routes";

const demoKey = "demo";

const Main: React.FC<{}> = () => {
    const history = useHistory();
    const dispatch: AppDispatch = useDispatch();
    const [opId] = React.useState(() => getNewId());
    const sessionType = useSelector(SessionSelectors.getSessionType);
    const token = useSelector(SessionSelectors.getUserToken);
    const client = useSelector(SessionSelectors.getClient);
    const isFetchingMissingBroadcasts = useSelector<IAppState, boolean>(
        (state) =>
            KeyValueSelectors.getKey(
                state,
                KeyValueKeys.FetchingMissingBroadcasts
            ) as boolean
    );

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isDemoMode =
        useSelector(SessionSelectors.isDemoMode) || searchParams.has(demoKey);

    const routeToApp = React.useCallback(() => {
        if (!isPath0App()) {
            history.push(path.normalize(paths.appPath));
        }
    }, [history]);

    React.useEffect(() => {
        if (isDemoMode && sessionType !== SessionType.App) {
            const demoData = seedDemoData();

            dispatch(UserActions.bulkAddUsers(demoData.users));
            dispatch(BlockActions.bulkAddBlocks(demoData.blocks));
            dispatch(
                NotificationActions.bulkAddNotifications(demoData.requests)
            );
            dispatch(RoomActions.bulkAddRooms(demoData.rooms));
            dispatch(OperationActions.bulkAddOperations(demoData.ops));
            dispatch(
                KeyValueActions.setKey({
                    key: KeyValueKeys.RootBlocksLoaded,
                    value: true,
                })
            );
            dispatch(
                SessionActions.loginUser({
                    token: "demo-token",
                    userId: demoData.web.user.customId,
                    isDemo: true,
                })
            );

            routeToApp();

            return;
        } else if (sessionType === SessionType.Uninitialized) {
            dispatch(initializeAppSessionOpAction({ opId }));
        }
    }, [sessionType, opId, dispatch, isDemoMode, routeToApp]);

    React.useEffect(() => {
        if (sessionType === SessionType.App && !isDemoMode) {
            SocketAPI.connectSocket({
                token: token!,
                clientId: client!.clientId,
            });

            routeToApp();
        } else if (sessionType === SessionType.Web) {
            SocketAPI.disconnectSocket();

            if (isPath0App()) {
                history.push("/");
            }
        }
    }, [sessionType, history, token, isDemoMode, client, routeToApp]);

    const renderInitializing = () => (
        <StyledContainer
            s={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
            }}
        >
            ...
        </StyledContainer>
    );

    const render = () => {
        switch (sessionType) {
            case SessionType.App:
                if (isFetchingMissingBroadcasts) {
                    return renderInitializing();
                }

                return <AppHomeContainer />;

            case SessionType.Web:
                return <Routes />;

            case SessionType.Uninitialized:
            case SessionType.Initializing:
            default:
                return renderInitializing();
        }
    };

    return (
        <React.Fragment>
            <AppVisibility />
            <ExistentialRenderer />
            {render()}
        </React.Fragment>
    );
};

export default Main;
