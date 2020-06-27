import React from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import MainLayout from "./MainLayout";

const MainLayoutContainer: React.FC<{}> = (props) => {
  const dispatch = useDispatch();
  const showAppMenu = useSelector((state) =>
    KeyValueSelectors.getKey(state as any, KeyValueKeys.AppMenu)
  ) as boolean;

  const showNewOrgForm = useSelector((state) =>
    KeyValueSelectors.getKey(state as any, KeyValueKeys.ShowNewOrgForm)
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

  React.useEffect(() => {
    dispatch(
      KeyValueActions.setKey({ key: KeyValueKeys.AppMenu, value: true })
    );
  }, [dispatch]);

  return (
    <MainLayout
      showOrgForm={!!showNewOrgForm}
      showAppMenu={showAppMenu}
      toggleMenu={toggleAppMenu}
      closeNewOrgForm={closeNewOrgForm}
    />
  );
};

export default MainLayoutContainer;
