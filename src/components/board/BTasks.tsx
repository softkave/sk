import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import RenderForDevice from "../RenderForDevice";
import BTasksDesktop from "./BTasksDesktop";
import BTasksMobile from "./BTasksMobile";

export interface IBTasksProps {
    block: IBlock;
    tasks: IBlock[];
    users: IUser[];
    onClickCreate: () => void;
    onClickUpdateBlock: (block: IBlock) => void;
    onSearchTextChange: (text: string) => void;
}

const BTasksProps: React.FC<IBTasksProps> = (props) => {
    return (
        <RenderForDevice
            renderForDesktop={() => <BTasksDesktop {...props} />}
            renderForMobile={() => <BTasksMobile {...props} />}
        />
    );
};

export default React.memo(BTasksProps);
