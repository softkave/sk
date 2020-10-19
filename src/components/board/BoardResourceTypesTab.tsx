/*eslint no-useless-computed-key: "off"*/

import path from "path";
import React from "react";
import { Redirect, useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import BoardTasksContainer from "./BoardTasksContainer";
import { IBoardResourceTypePathMatch } from "./types";

export interface IBoardResourceTypesTabProps {
    blockPath: string;
    block: IBlock;
}

const BoardResourceTypesTab = (props: IBoardResourceTypesTabProps) => {
    const { blockPath, block } = props;

    const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
        `${blockPath}/:resourceType`
    );

    const resourceType =
        resourceTypeMatch && resourceTypeMatch.params.resourceType;

    if (!resourceType) {
        const nextPath = path.normalize(blockPath + `/boards`);
        return <Redirect to={nextPath} />;
    }

    return (
        <StyledContainer
            s={{
                flex: 1,
                overflow: "hidden",
                flexDirection: "column",
                paddingTop: "24px",

                ["& .ant-tabs-content"]: {
                    height: "100%",
                },

                ["& .ant-tabs-tabpane-active"]: {
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <BoardTasksContainer block={block} />
        </StyledContainer>
    );
};

export default BoardResourceTypesTab;
