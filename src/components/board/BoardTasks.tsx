import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import RenderForDevice from "../RenderForDevice";
import BoardTasksDesktop from "./BoardTasksDesktop";
import BoardTasksMobile from "./BoardTasksMobile";

export interface IBoardTasksProps {
    block: IBlock;
    tasks: IBlock[];
    users: IUser[];
    onClickCreate: () => void;
    onClickUpdateBlock: (block: IBlock) => void;
    onSearchTextChange: (text: string) => void;
}

const BoardTasks: React.FC<IBoardTasksProps> = (props) => {
    return (
        <RenderForDevice
            renderForDesktop={() => <BoardTasksDesktop {...props} />}
            renderForMobile={() => <BoardTasksMobile {...props} />}
        />
    );
};

export default React.memo(BoardTasks);
