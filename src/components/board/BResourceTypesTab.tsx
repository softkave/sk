import { Tabs } from "antd";
import path from "path";
import React from "react";
import { Redirect, useHistory, useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import BTasksContainer from "./BTasksContainer";
import { IBoardResourceTypePathMatch } from "./types";

export interface IBResourceTypesTabProps {
    blockPath: string;
    block: IBlock;
}

const BResourceTypesTab = (props: IBResourceTypesTabProps) => {
    const { blockPath, block } = props;

    const history = useHistory();
    const resourceTypes = ["tasks"];
    const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
        `${blockPath}/:resourceType`
    );

    const resourceType =
        resourceTypeMatch && resourceTypeMatch.params.resourceType;

    if (!resourceType) {
        const nextPath = path.normalize(blockPath + `/boards`);
        return <Redirect to={nextPath} />;
    }

    const onSelectResourceType = (key: string) => {
        const nextPath = `${blockPath}/${key}`;
        history.push(nextPath);
    };

    const renderContent = (type) => {
        switch (type) {
            case "tasks":
                return <BTasksContainer block={block} />;

            default:
                return null;
        }
    };

    const renderTab = (type) => {
        return (
            <Tabs.TabPane
                tab={<span style={tabSpanStyle}>{type}</span>}
                key={type}
            >
                {renderContent(type)}
            </Tabs.TabPane>
        );
    };

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
            {renderContent("tasks")}
            {/* <Tabs
                activeKey={resourceType}
                onChange={(key) => onSelectResourceType(key)}
                tabBarGutter={0}
                style={{ height: "100%", width: "100%" }}
            >
                {resourceTypes.map(renderTab)}
            </Tabs> */}
        </StyledContainer>
    );
};

const tabSpanStyle: React.CSSProperties = {
    textTransform: "capitalize",
    padding: "0 16px",
};

export default React.memo(BResourceTypesTab);
