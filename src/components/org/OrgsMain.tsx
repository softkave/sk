import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import StyledContainer from "../styled/Container";
import DeviceScrollbar from "../utilities/DeviceScrollbar";
import OrgsList from "./OrgsList";
import OrgsListHeader from "./OrgsListHeader";

export interface IOrgsMainProps {
    orgs: IBlock[];
    requests: INotification[];
    onAddOrg: () => void;
    onSelectOrg: (org: IBlock) => void;
    onSelectRequest: (request: INotification) => void;

    isLoading?: boolean;
    errorMessage?: string;
    selectedId?: string;
}

const OrgsMain: React.FC<IOrgsMainProps> = (props) => {
    const {
        orgs,
        isLoading,
        errorMessage,
        selectedId,
        onAddOrg,
        onSelectOrg,
        requests,
        onSelectRequest,
    } = props;
    const [searchQuery, setSearchQuery] = React.useState("");

    const renderContent = () => {
        if (isLoading) {
            return null;
        }

        if (errorMessage) {
            return (
                <Empty
                    image={<ExclamationCircleOutlined />}
                    description={errorMessage}
                ></Empty>
            );
        }

        let o = orgs;
        let r = requests;

        if (searchQuery) {
            const searchTextLower = searchQuery.toLowerCase();

            o = orgs.filter((org) => {
                return org.name?.toLowerCase().includes(searchTextLower);
            });

            r = requests.filter((request) => {
                return request.from?.blockName
                    .toLowerCase()
                    .includes(searchTextLower);
            });
        }

        return (
            <OrgsList
                orgs={o}
                requests={r}
                selectedId={selectedId}
                onClickBlock={onSelectOrg}
                onClickRequest={onSelectRequest}
            />
        );
    };

    return (
        <StyledContainer
            s={{ height: "100%", width: "100%", flexDirection: "column" }}
        >
            <OrgsListHeader
                onClickCreate={onAddOrg}
                onSearchTextChange={setSearchQuery}
                style={{ paddingBottom: "8px" }}
            />
            <DeviceScrollbar>{renderContent()}</DeviceScrollbar>
        </StyledContainer>
    );
};

export default React.memo(OrgsMain);
