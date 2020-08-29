import React from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import MainDesktop from "./MainDesktop";

const MainDesktopContainer: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const showAppMenu = useSelector((state) =>
        KeyValueSelectors.getKey(state as any, KeyValueKeys.AppMenu)
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
                key: KeyValueKeys.AppMenu,
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

    return (
        <MainDesktop
            showOrgForm={!!showNewOrgForm}
            showAppMenu={showAppMenu}
            rootBlocksLoaded={!!rootBlocksLoaded}
            toggleMenu={toggleAppMenu}
            closeNewOrgForm={closeNewOrgForm}
        />
    );
};

export default MainDesktopContainer;
