import React from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import { logoutUserOpAction } from "../../redux/operations/session/logoutUser";
import SessionSelectors from "../../redux/session/selectors";
import AppHome from "./AppHome";

const AppHomeContainer: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const user = useSelector(SessionSelectors.assertGetUser);

    const showAppMenu = useSelector((state) =>
        KeyValueSelectors.getKey(state as any, KeyValueKeys.ShowAppMenu)
    ) as boolean;

    const showNewOrgForm = useSelector((state) =>
        KeyValueSelectors.getKey(state as any, KeyValueKeys.ShowNewOrgForm)
    );

    const rootBlocksLoaded = useSelector((state) =>
        KeyValueSelectors.getKey(state as any, KeyValueKeys.RootBlocksLoaded)
    );

    const toggleAppMenu = React.useCallback(() => {
        const newAppMenuState = !showAppMenu;
        dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.ShowAppMenu,
                value: newAppMenuState,
            })
        );
    }, [showAppMenu, dispatch]);

    const closeNewOrgForm = React.useCallback(() => {
        dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.ShowNewOrgForm,
                value: false,
            })
        );
    }, [dispatch]);

    const onLogout = React.useCallback(() => {
        dispatch(logoutUserOpAction());
    }, [dispatch]);

    return (
        <AppHome
            user={user}
            showOrgForm={!!showNewOrgForm}
            showAppMenu={showAppMenu}
            rootBlocksLoaded={!!rootBlocksLoaded}
            toggleMenu={toggleAppMenu}
            closeNewOrgForm={closeNewOrgForm}
            onLogout={onLogout}
        />
    );
};

export default AppHomeContainer;