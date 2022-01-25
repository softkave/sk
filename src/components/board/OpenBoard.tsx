import { css } from "@emotion/css";
import { Button, Tabs } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { appClassNames } from "../classNames";
import BoardFormContainer, {
  IBoardFormContainerProps,
} from "./BoardFormContainer";
import BoardStats from "./BoardStats";

export interface IOpenBoardProps extends IBoardFormContainerProps {}

enum OpenBoardTabs {
  Form,
  Stats,
}

const OpenBoard: React.FC<IOpenBoardProps> = (props) => {
  const { board: block, onClose } = props;
  const formContainer = <BoardFormContainer {...props} />;

  if (block) {
    return (
      <div className={appClassNames.tabsWrapper}>
        <Tabs
          tabBarExtraContent={{
            left: (
              <div
                className={css({
                  margin: "0px 24px 0px 16px",
                  display: "inline-block",
                })}
              >
                <Button
                  style={{ cursor: "pointer" }}
                  onClick={onClose}
                  className="icon-btn"
                >
                  <ArrowLeft />
                </Button>
              </div>
            ),
          }}
        >
          <Tabs.TabPane tab="Form" key={OpenBoardTabs.Form}>
            {formContainer}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Stats" key={OpenBoardTabs.Stats}>
            <BoardStats board={block} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  } else {
    return formContainer;
  }
};

export default OpenBoard;
