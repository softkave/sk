/*eslint no-useless-computed-key: "off"*/

import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { IUnseenChatsCountByOrg } from "../../redux/key-value/types";
import StyledContainer from "../styled/Container";
import Scrollbar from "../utilities/Scrollbar";
import OrgsList from "./OrgsList";
import OrgsListHeader from "./OrgsListHeader";

export interface IOrgsMainProps {
    orgs: IBlock[];
    requests: INotification[];
    unseenChatsCountMapByOrg: IUnseenChatsCountByOrg;
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
        requests,
        unseenChatsCountMapByOrg,
        onAddOrg,
        onSelectOrg,
        onSelectRequest,
    } = props;

    const [searchQuery, setSearchQuery] = React.useState("");

    const renderContent = () => {
        if (isLoading) {
            return null;
        }

        if (errorMessage) {
            return (
                <StyledContainer
                    s={{
                        display: "block",

                        ["& .ant-empty-image"]: {
                            display: "flex",
                            justifyContent: "center",
                        },
                    }}
                >
                    <Empty
                        image={<ExclamationCircleOutlined />}
                        description={errorMessage}
                    ></Empty>
                </StyledContainer>
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
                unseenChatsCountMapByOrg={unseenChatsCountMapByOrg}
                selectedId={selectedId}
                onClickBlock={onSelectOrg}
                onClickRequest={onSelectRequest}
            />
        );
    };

    return (
        <StyledContainer
            s={{
                height: "100%",
                width: "100%",
                flexDirection: "column",
                paddingTop: "16px",
                paddingBottom: "8px",
            }}
        >
            <OrgsListHeader
                onClickCreate={onAddOrg}
                onSearchTextChange={setSearchQuery}
                style={{ paddingBottom: "8px" }}
                placeholder="Search orgs and requests..."
            />
            <Scrollbar>{renderContent()}</Scrollbar>
        </StyledContainer>
    );
};

export default React.memo(OrgsMain);
