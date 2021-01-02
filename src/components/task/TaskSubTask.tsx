import { LoadingOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import React from "react";
import { ISubTask } from "../../models/block/block";
import StyledContainer from "../styled/Container";

export interface ITaskSubTaskProps {
    subTask: ISubTask;
    onToggleSubTask: () => Promise<void>;
}

const TaskSubTask: React.FC<ITaskSubTaskProps> = (props) => {
    const { subTask, onToggleSubTask } = props;

    const [loading, setLoading] = React.useState(false);

    const internalOnToggle = React.useCallback(async () => {
        setLoading(true);
        await onToggleSubTask();
        setLoading(false);
    }, [setLoading, onToggleSubTask]);

    return (
        <StyledContainer key={subTask.customId}>
            <StyledContainer>
                {loading ? (
                    <LoadingOutlined />
                ) : (
                    <Checkbox
                        checked={!!subTask.completedBy}
                        onChange={internalOnToggle}
                    />
                )}
            </StyledContainer>
            <StyledContainer s={{ marginLeft: "16px", flex: 1 }}>
                {subTask.description}
            </StyledContainer>
        </StyledContainer>
    );
};

export default TaskSubTask;
