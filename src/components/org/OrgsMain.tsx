import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import StyledContainer from "../styled/Container";
import OrgsList from "./OrgsList";
import OrgsListHeader from "./OrgsListHeader";

export interface ILayoutMenuOrgsSectionProps {
    orgs: IBlock[];
    requests: INotification[];
    onAddOrg: () => void;
    onSelectOrg: (org: IBlock) => void;
    onSelectRequest: (request: INotification) => void;

    isLoading?: boolean;
    errorMessage?: string;
    selectedId?: string;
}

const LayoutMenuOrgsSection: React.FC<ILayoutMenuOrgsSectionProps> = (
    props
) => {
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

    const renderContent = React.useCallback(() => {
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
    }, [
        isLoading,
        errorMessage,
        orgs,
        requests,
        onSelectRequest,
        onSelectOrg,
        searchQuery,
    ]);

    return (
        <StyledContainer
            s={{ height: "100%", width: "100%", flexDirection: "column" }}
        >
            <OrgsListHeader
                onClickCreate={onAddOrg}
                onSearchTextChange={setSearchQuery}
                style={{ paddingBottom: "8px" }}
            />
            <Scrollbars>{renderContent()}</Scrollbars>
        </StyledContainer>
    );
};

export default React.memo(LayoutMenuOrgsSection);
