import styled from "@emotion/styled";
import React from "react";
import AppHeaderContainer from "../components/header/AppHeaderContainer";
import IView from "../redux/view/view";
import AppViewManager from "./AppViewManager";

export interface IAppProps {
  currentView: IView;
}

class App extends React.Component<IAppProps> {
  public render() {
    const { currentView } = this.props;

    return (
      <StyledApp>
        <StyledAppHeader>
          <AppHeaderContainer />
        </StyledAppHeader>
        <StyledAppBody>
          <AppViewManager currentView={currentView} />
        </StyledAppBody>
      </StyledApp>
    );
  }
}

export default App;

const StyledApp = styled.div({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden"
});

const StyledAppHeader = styled.div({});

const StyledAppBody = styled.div({
  display: "flex",
  flex: 1,
  overflow: "hidden"
});
