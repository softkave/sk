import { css } from "@emotion/css";
import { Col, Row, Space, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBoard } from "../../models/board/types";
import BoardSelectors from "../../redux/boards/selectors";
import { appLoadingKeys } from "../../redux/key-value/types";
import { getAverageTimeToCompleteTasksOpAction } from "../../redux/operations/board/getAverageTimeToCompleteTasks";
import { IAppState } from "../../redux/types";
import { pluralize } from "../../utils/utils";
import { useLoadingNode } from "../hooks/useLoadingNode";
import { useLoadingStateWithOp } from "../hooks/useLoadingState";

export interface IBoardStatsProps {
  board: IBoard;
}

const classes = {
  statText: css({ fontSize: "48px" }),
  statMins: css({ fontSize: "16px" }),
  statLabel: css({ display: "block" }),
};

const BoardStats: React.FC<IBoardStatsProps> = (props) => {
  const { board } = props;
  const op = useLoadingStateWithOp({
    key: appLoadingKeys.boardAverageTimeToCompleteTask(board.workspaceId, board.customId),
    initFn: async (dispatch) => {
      // TODO: reload board stats on intervals
      await dispatch(
        getAverageTimeToCompleteTasksOpAction({
          boardId: board.customId,
          key: appLoadingKeys.boardAverageTimeToCompleteTask(board.workspaceId, board.customId),
        })
      );
    },
  });

  const avgTimeToCompleteTasks = useSelector<IAppState, number | undefined>(
    (state) => BoardSelectors.assertGetOne(state, board.customId).avgTimeToCompleteTasks
  );

  const loadingNode = useLoadingNode(op.loadingState);
  if (loadingNode.stateNode) {
    return loadingNode.stateNode;
  }

  const { time, unit } = millisecondsToMins(avgTimeToCompleteTasks || 0);
  return (
    <Row style={{ padding: "16px", paddingTop: "0px" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col span={12}>
        <Space direction="vertical">
          <Typography.Text type="secondary" className={classes.statText}>
            {time}{" "}
            <Typography.Text type="secondary" className={classes.statMins}>
              {unit}
            </Typography.Text>
          </Typography.Text>
          <Typography.Text className={classes.statLabel}>
            Average time to complete task
          </Typography.Text>
        </Space>
      </Col>
      <Col span={12} />
    </Row>
  );
};

export default BoardStats;

function millisecondsToMins(time: number) {
  const secs = Math.floor(time / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (secs < 60) {
    return { time: secs, unit: pluralize("sec", secs) };
  } else if (mins < 60) {
    return { time: mins, unit: pluralize("min", mins) };
  } else if (hours < 24) {
    return { time: hours, unit: pluralize("hour", hours) };
  } else if (days < 30) {
    return { time: days, unit: pluralize("day", days) };
  } else if (months < 12) {
    return { time: months, unit: pluralize("month", months) };
  } else {
    return { time: years, unit: pluralize("year", years) };
  }
}
