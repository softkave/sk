import React from "react";
import StyledContainer from "../styled/Container";
import BoardHeader, { IBoardHeaderProps } from "./BoardHeader";
import BoardResourceTypesTab, {
    IBoardResourceTypesTabProps,
} from "./BoardResourceTypesTab";

export type IBoardProps = IBoardHeaderProps & IBoardResourceTypesTabProps;

const Board: React.FC<IBoardProps> = (props) => {
    return (
        <StyledContainer
            s={{ flexDirection: "column", flex: 1, width: "100%" }}
        >
            <BoardHeader {...props} />
            <BoardResourceTypesTab {...props} />
        </StyledContainer>
    );
};

export default Board;
