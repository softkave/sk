import React from "react";
import { useSelector } from "react-redux";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import { logoutUserOpAction } from "../../redux/operations/session/logoutUser";
import { useAppDispatch } from "../hooks/redux";
import AppHome from "./AppHome";

const AppHomeContainer: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const showAppMenu = useSelector((state) =>
    KeyValueSelectors.getKey(state as any, KeyValueKeys.ShowAppMenu)
  ) as boolean;

  const showNewOrgForm = useSelector((state) =>
    KeyValueSelectors.getKey(state as any, KeyValueKeys.ShowNewOrgForm)
  );

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
      showOrgForm={!!showNewOrgForm}
      showAppMenu={showAppMenu}
      closeNewOrgForm={closeNewOrgForm}
      onLogout={onLogout}
    />
  );
};

export default AppHomeContainer;
