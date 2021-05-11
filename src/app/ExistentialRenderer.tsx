import { notification } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyValueActions from "../redux/key-value/actions";
import KeyValueSelectors from "../redux/key-value/selectors";
import { KeyValueKeys } from "../redux/key-value/types";
import { IAppState } from "../redux/types";

// There is nothing existential about this component, but just for drammatic reasons it's named so.
// Feel free to change the name :)

const fifteenSeconds = 15;

const ExistentialRenderer: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const loginAgain = useSelector<IAppState, boolean>((state) =>
        KeyValueSelectors.getKey(state, KeyValueKeys.LoginAgain)
    );

    const subscribeToPushNotifications = useSelector<IAppState, boolean>(
        (state) =>
            KeyValueSelectors.getKey(
                state,
                KeyValueKeys.SubscribeToPushNotifications
            )
    );

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
        if (subscribeToPushNotifications) {
            // TODO: implement
        }
    }, [subscribeToPushNotifications, dispatch]);

    return null;
};

export default ExistentialRenderer;
