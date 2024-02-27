import { InfoCircleOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Divider, Tooltip, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBoard } from "../../models/board/types";
import { ISprint } from "../../models/sprint/types";
import { getSprintRemainingWorkingDays } from "../../models/sprint/utils";
import SprintSelectors from "../../redux/sprints/selectors";
import { IAppState } from "../../redux/types";
import { pluralize } from "../../utils/utils";

export interface ICurrentSprintHeaderProps {
  board: IBoard;
}

const kWorkingDaysExplanation =
  "Workings days refer to days of the week, Monday to Friday";

const CurrentSprintHeader: React.FC<ICurrentSprintHeaderProps> = (props) => {
  const { board } = props;
  const sprint = useSelector<IAppState, ISprint | null>((state) => {
    if (!board.currentSprintId) {
      return null;
    }

    return SprintSelectors.getSprint(state, board.currentSprintId);
  });

  if (!sprint) {
    return null;
  }

  const remainingWorkingDays = getSprintRemainingWorkingDays(sprint);
  const remainingDaysAbs = Math.abs(remainingWorkingDays);
  let remainingDaysNode: React.ReactElement = <span />;
  const tooltip = (
    <Tooltip title={kWorkingDaysExplanation}>
      <InfoCircleOutlined style={{ paddingLeft: "8px" }} />
    </Tooltip>
  );

  const containerClass = css({
    display: "inline-flex",
    alignItems: "center",
  });

  const nameClass = css({
    textTransform: "capitalize",
  });

  if (remainingWorkingDays > 0) {
    remainingDaysNode = (
      <span className={containerClass}>
        <Typography.Text strong className={nameClass}>
          {sprint.name}
        </Typography.Text>
        <Divider
          type="vertical"
          style={{ borderLeft: "1px solid rgba(0, 0, 0, 0.6)" }}
        />
        <Typography.Text type="success">
          {remainingDaysAbs} working {pluralize("day", remainingDaysAbs)}{" "}
          remaining
        </Typography.Text>
        {tooltip}
      </span>
    );
  } else if (remainingWorkingDays < 0) {
    remainingDaysNode = (
      <span className={containerClass}>
        <Typography.Text strong className={nameClass}>
          {sprint.name}
        </Typography.Text>
        <Divider
          type="vertical"
          style={{ borderLeft: "1px solid rgba(0, 0, 0, 0.6)" }}
        />
        <Typography.Text type="danger">
          {remainingDaysAbs} working {pluralize("day", remainingDaysAbs)}{" "}
          overdue
        </Typography.Text>
        {tooltip}
      </span>
    );
  } else {
    remainingDaysNode = (
      <span className={containerClass}>
        <Typography.Text strong className={nameClass}>
          {sprint.name}
        </Typography.Text>
        <Divider
          type="vertical"
          style={{ borderLeft: "1px solid rgba(0, 0, 0, 0.6)" }}
        />
        <Typography.Text type="warning">Sprint is due</Typography.Text>
        {tooltip}
      </span>
    );
  }

  return remainingDaysNode;
};

export default CurrentSprintHeader;
