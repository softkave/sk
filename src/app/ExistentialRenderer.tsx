import { notification } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyValueActions from "../redux/key-value/actions";
import KeyValueSelectors from "../redux/key-value/selectors";
import { KeyValueKeys } from "../redux/key-value/types";
import { IAppState } from "../redux/types";

// There is nothing existential about this component, but just for drammatic reasons it's named so.
// Feel free to change the name :)

const SECS_15 = 15;

const ExistentialRenderer: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const loginAgain = useSelector<IAppState, boolean>((state) =>
        KeyValueSelectors.getKey(state, KeyValueKeys.LOGIN_AGAIN)
    );

    React.useEffect(() => {
        if (loginAgain) {
            notification.error({
                message: "Please login again",
                description:
                    "Error processing your request, please login again.",
                duration: SECS_15,
            });

            dispatch(
                KeyValueActions.setKey({
                    key: KeyValueKeys.LOGIN_AGAIN,
                    value: false,
                })
            );
        }
    }, [loginAgain, dispatch]);

    return null;
};

export default ExistentialRenderer;
