import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setKeyValue } from "../../redux/key-value/actions";
import { KeyValueProperties } from "../../redux/key-value/reducer";
import { getKeyValue } from "../../redux/key-value/selectors";
import MainLayout from "./MainLayout";

const MainLayoutContainer: React.FC<{}> = (props) => {
  const dispatch = useDispatch();
  const showAppMenu = useSelector((state) =>
    getKeyValue(state as any, KeyValueProperties.AppMenu)
  ) as boolean;

  const toggleAppMenu = React.useCallback(() => {
    const newAppMenuState = !showAppMenu;
    dispatch(setKeyValue([KeyValueProperties.AppMenu, newAppMenuState]));
  }, [showAppMenu]);

  React.useEffect(() => {
    dispatch(setKeyValue([KeyValueProperties.AppMenu, true]));
  }, []);

  return <MainLayout showAppMenu={showAppMenu} toggleMenu={toggleAppMenu} />;
};

export default MainLayoutContainer;
