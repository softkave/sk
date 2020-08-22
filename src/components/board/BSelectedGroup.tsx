import { Tabs } from "antd";
import React from "react";

export interface IBSelectedGroupProps {
  selected: string;
  options: string[];
  onSelect: (key: string) => void;
  renderContent: (key: string) => React.ReactNode;
}

const BSelectedGroup = (props: IBSelectedGroupProps) => {
  const { selected, options, onSelect, renderContent } = props;

  return (
    <Tabs
      activeKey={selected}
      onChange={(key) => onSelect(key)}
      tabBarGutter={0}
    >
      {options.map((option) => {
        return (
          <Tabs.TabPane
            tab={
              <span
                style={{
                  textTransform: "capitalize",
                  padding: "0 16px",
                }}
              >
                {option}
              </span>
            }
            key={option}
          >
            {renderContent(selected)}
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
};

export default React.memo(BSelectedGroup);
