import { css } from "@emotion/css";
import { Col, Row, Space, Typography } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBoard } from "../../models/board/types";
import BlockSelectors from "../../redux/blocks/selectors";
import { getAverageTimeToCompleteTasksOpAction } from "../../redux/operations/board/getAverageTimeToCompleteTasks";
import OperationType from "../../redux/operations/OperationType";
import { AppDispatch, IAppState } from "../../redux/types";
import { pluralize } from "../../utils/utils";
import useOperation from "../hooks/useOperation";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utilities/LoadingEllipsis";

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
  const dispatch: AppDispatch = useDispatch();
  const op = useOperation(
    {
      resourceId: board.customId,
      type: OperationType.GetAverageTimeToCompleteTasks,
    },
    async (params) => {
      // TODO: reload board stats on intervals
      if (!params.operation) {
        await dispatch(
          getAverageTimeToCompleteTasksOpAction({
            opId: params.opId,
            boardId: board.customId,
          })
        );
      }
    }
  );

  const avgTimeToCompleteTasks = useSelector<IAppState, number | undefined>(
    (state) =>
      BlockSelectors.getBlock(state, board.customId).avgTimeToCompleteTasks
  );

  if (op.isLoading) {
    return <LoadingEllipsis />;
  } else if (op.error) {
    return <MessageList fill messages={op.error} />;
  }

  const { time, unit } = millisecondsToMins(avgTimeToCompleteTasks || 0);
  return (
    <Row
      style={{ padding: "16px", paddingTop: "0px" }}
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
    >
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
