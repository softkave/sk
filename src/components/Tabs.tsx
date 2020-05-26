import React from "react";
import StyledContainer from "./styled/Container";

export interface ITab {
  key: string;
  title: React.ReactNode;
  render: () => React.ReactNode;
}

export interface ITabsProps {
  tabs: ITab[];
  activeTabKey: string;
  onChange: (key: string) => void;
  alignHeader?: React.CSSProperties["justifyContent"];
  scrollInContent?: boolean;
}

const Tabs: React.FC<ITabsProps> = (props) => {
  const { tabs, activeTabKey, onChange, alignHeader, scrollInContent } = props;

  const getActiveTab = () => {
    return tabs.find((tab) => tab.key === activeTabKey);
  };

  const activeTab = getActiveTab();

  const renderTabHeader = (tab: ITab, i: number) => {
    return (
      <StyledContainer
        key={tab.key}
        onClick={() => onChange(tab.key)}
        s={{
          paddingRight: "24px",
          paddingLeft: i === 0 ? "16px" : 0,
          color: activeTab?.key === tab.key ? "rgb(66,133,244)" : "inherit",
          cursor: "pointer",

          // TODO: this should not be done here
          whiteSpace: "nowrap",
        }}
      >
        {tab.title}
      </StyledContainer>
    );
  };

  const renderHeader = () => {
    return (
      <StyledContainer
        s={{
          flexWrap: "nowrap",
          overflowX: "auto",
          justifyContent: alignHeader,
        }}
      >
        {tabs.map((tab, i) => renderTabHeader(tab, i))}
      </StyledContainer>
    );
  };

  const renderActiveTab = () => {
    return (
      <StyledContainer
        s={{
          flex: 1,
          overflow: scrollInContent ? "auto" : "initial",
        }}
      >
        {activeTab?.render()}
      </StyledContainer>
    );
  };

  return (
    <StyledContainer
      s={{ flexDirection: "column", width: "100%", height: "100%" }}
    >
      {renderHeader()}
      {renderActiveTab()}
    </StyledContainer>
  );
};

export default Tabs;
