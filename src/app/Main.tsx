import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import MainLayoutContainer from "../components/layout/MainLayoutContainer";
import { isPath0App, makePath, paths } from "../components/layout/path";
import StyledContainer from "../components/styled/Container";
import seedDemoData from "../models/seedDemoData";
import { connectSocket, disconnectSocket } from "../net/socket";
import BlockActions from "../redux/blocks/actions";
import KeyValueActions from "../redux/key-value/actions";
import KeyValueSelectors from "../redux/key-value/selectors";
import { KeyValueKeys } from "../redux/key-value/types";
import NotificationActions from "../redux/notifications/actions";
import OperationActions from "../redux/operations/actions";
import { initializeAppSessionOperationAction } from "../redux/operations/session/initializeAppSession";
import SessionActions from "../redux/session/actions";
import SessionSelectors from "../redux/session/selectors";
import { SessionType } from "../redux/session/types";
import { AppDispatch, IAppState } from "../redux/types";
import UserActions from "../redux/users/actions";
import { getNewId } from "../utils/utils";
import Routes from "./Routes";

let timeoutHandle: number;
const demoKey = "demo";

const handleHidden = () => {
    let hidden = "hidden";

    // Standards:
    if (hidden in document) {
        document.addEventListener("visibilitychange", onchange);
    } else if ((hidden = "mozHidden") in document) {
        document.addEventListener("mozvisibilitychange", onchange);
    } else if ((hidden = "webkitHidden") in document) {
        document.addEventListener("webkitvisibilitychange", onchange);
    } else if ((hidden = "msHidden") in document) {
        document.addEventListener("msvisibilitychange", onchange);
    } else if ("onfocusin" in document) {
        // IE 9 and lower:
        // @ts-ignore
        document.onfocusin = document.onfocusout = onchange;
    } else {
        // All others:
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
    }

    function onchange(evt) {
        let state;
        const v = "visible";
        const h = "hidden";
        const evtMap = {
            focus: v,
            focusin: v,
            pageshow: v,
            blur: h,
            focusout: h,
            pagehide: h,
        };

        evt = evt || window.event;
        if (evt.type in evtMap) {
            state = evtMap[evt.type];
        } else {
            // @ts-ignore
            state = this[hidden] ? "hidden" : "visible";
        }

        function hiddenTimeout() {
            timeoutHandle = 0;

            // disconnectSocket();
        }

        if (state === v) {
            if (timeoutHandle) {
                window.clearTimeout(timeoutHandle);
            }

            // const socket = getSocket();

            // if (!socket) {
            //   connectSocket({token: token!});
            // }
        } else {
            const timeout = 5 * 60 * 1000;
            timeoutHandle = window.setTimeout(hiddenTimeout, timeout);
        }
    }

    // set the initial state (but only if browser supports the Page Visibility API)
    if (document[hidden] !== undefined) {
        // TODO: wouldn't it be better if we don't connect at all
        //   if the page is hidden

        onchange({ type: document[hidden] ? "blur" : "focus" });
    }
};

const Main: React.FC<{}> = () => {
    const history = useHistory();
    const dispatch: AppDispatch = useDispatch();
    const [opId] = React.useState(() => getNewId());
    const sessionType = useSelector(SessionSelectors.getSessionType);
    const token = useSelector(SessionSelectors.getUserToken);
    const clientId = useSelector(SessionSelectors.getClientId);
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
            history.push(makePath(paths.appPath));
        }
    }, [history]);

    React.useEffect(() => {
        if (isDemoMode && sessionType !== SessionType.App) {
            const demoData = seedDemoData();

            dispatch(UserActions.bulkAddUsers(demoData.users));
            dispatch(BlockActions.bulkAddBlocks(demoData.blocks));
            dispatch(
                NotificationActions.bulkAddNotifications(demoData.notifications)
            );
            dispatch(OperationActions.bulkAddOperations(demoData.operations));
            dispatch(
                KeyValueActions.setKey({
                    key: KeyValueKeys.RootBlocksLoaded,
                    value: true,
                })
            );
            dispatch(
                SessionActions.loginUser({
                    clientId: "demo-clientId",
                    token: "demo-token",
                    userId: demoData.user.customId,
                    isDemo: true,
                })
            );

            routeToApp();

            return;
        } else if (sessionType === SessionType.Uninitialized) {
            dispatch(initializeAppSessionOperationAction({ opId }));
        }
    }, [sessionType, opId, dispatch, isDemoMode, routeToApp]);

    React.useEffect(() => {
        if (sessionType === SessionType.App && !isDemoMode) {
            connectSocket({
                clientId: clientId!,
                token: token!,
            });

            handleHidden();
            routeToApp();
        } else if (sessionType === SessionType.Web) {
            disconnectSocket();

            if (isPath0App()) {
                history.push("/");
            }
        }
    }, [sessionType, clientId, history, token, isDemoMode, routeToApp]);

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

    switch (sessionType) {
        case SessionType.App:
            if (isFetchingMissingBroadcasts) {
                return renderInitializing();
            }

            return <MainLayoutContainer />;

        case SessionType.Web:
            return <Routes />;

        case SessionType.Uninitialized:
        case SessionType.Initializing:
        default:
            return renderInitializing();
    }
};

export default Main;
