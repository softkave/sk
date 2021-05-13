import { notification } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    IOutgoingUpdateSocketEntryPacket,
    OutgoingSocketEvents,
} from "../net/socket/outgoingEventTypes";
import SocketAPI from "../net/socket/socket";
import KeyValueActions from "../redux/key-value/actions";
import KeyValueSelectors from "../redux/key-value/selectors";
import { KeyValueKeys } from "../redux/key-value/types";
import SessionSelectors from "../redux/session/selectors";
import { IAppState } from "../redux/types";
import { devError } from "../utils/log";

// There is nothing existential about this component, but just for drammatic reasons it's named so.
// Feel free to change the name :)

const fifteenSeconds = 15;

const ExistentialRenderer: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const loginAgain = useSelector<IAppState, boolean>((state) =>
        KeyValueSelectors.getKey(state, KeyValueKeys.LoginAgain)
    );

    const isAppHidden = useSelector<IAppState, boolean>((state) =>
        KeyValueSelectors.getKey(state, KeyValueKeys.IsAppHidden)
    );

    const isLoggedIn = useSelector(SessionSelectors.isUserSignedIn);

    React.useEffect(() => {
        if (loginAgain) {
            notification.error({
                message: "Please login again",
                description:
                    "Error processing your request, please login again.",
                duration: fifteenSeconds,
            });

            dispatch(
                KeyValueActions.setKey({
                    key: KeyValueKeys.LoginAgain,
                    value: false,
                })
            );
        }
    }, [loginAgain, dispatch]);

    React.useEffect(() => {
        if (isLoggedIn) {
            // TODO: we should also disconnect the socket maybe after 15 minutes
            // of app being hidden
            try {
                const data: IOutgoingUpdateSocketEntryPacket = {
                    isInactive: isAppHidden,
                };

                SocketAPI.promisifiedEmit(
                    OutgoingSocketEvents.UpdateSocketEntry,
                    data
                );
            } catch (error) {
                devError(error);
            }
        }
    }, [isLoggedIn, isAppHidden, dispatch]);

    return null;
};

export default ExistentialRenderer;
