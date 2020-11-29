import { InfoCircleTwoTone } from "@ant-design/icons";
import { Divider, Tag, Tooltip, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { getSprintRemainingWorkingDays } from "../../models/sprint/utils";
import SprintSelectors from "../../redux/sprints/selectors";
import { IAppState } from "../../redux/types";
import { pluralize } from "../../utils/utils";

export interface ICurrentSprintHeaderProps {
    board: IBlock;
}

const kWorkingDaysExplanation =
    "Workings days refer to days of the week, Monday to Friday.";

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
            <InfoCircleTwoTone style={{ paddingLeft: "4px" }} />
        </Tooltip>
    );

    if (remainingWorkingDays > 0) {
        remainingDaysNode = (
            <span>
                <Tag color="green">{sprint.name}</Tag>
                <Typography.Text>
                    {remainingDaysAbs} working{" "}
                    {pluralize("day", remainingDaysAbs)} remaining {tooltip}
                </Typography.Text>
            </span>
        );
    } else if (remainingWorkingDays < 0) {
        remainingDaysNode = (
            <span>
                <Tag color="red">{sprint.name}</Tag>
                <Typography.Text>
                    {remainingDaysAbs} working{" "}
                    {pluralize("day", remainingDaysAbs)} overdue {tooltip}
                </Typography.Text>
            </span>
        );
    } else {
        remainingDaysNode = (
            <span>
                <Typography.Text strong>{sprint.name}</Typography.Text>
                <Divider
                    type="vertical"
                    style={{ borderLeft: "1px solid rgba(0, 0, 0, 0.6)" }}
                />
                <Typography.Text style={{ color: "green" }}>
                    Due today
                </Typography.Text>
            </span>
        );
    }

    return remainingDaysNode;
};

export default CurrentSprintHeader;
