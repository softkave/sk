import { css } from "@emotion/css";
import { Divider, Typography } from "antd";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { CollaborationRequestStatusType } from "../../models/notification/notification";
import { IAppOrganization } from "../../models/organization/types";
import { IUnseenChatsCountByOrg } from "../../redux/key-value/types";
import BlockThumbnail from "../block/BlockThumnail";
import { getRequestStatus } from "../collaborator/utils";
import Message from "../Message";
import StyledContainer from "../styled/Container";
import OrgCollaborationRequestThumbnail from "./OrgCollaborationRequestThumbnail";

export interface IOrgsListProps {
  orgs: IAppOrganization[];
  requests: ICollaborationRequest[];
  unseenChatsCountMapByOrg: IUnseenChatsCountByOrg;
  selectedId?: string;
  onClickOrganization: (block: IAppOrganization) => void;
  onClickRequest: (request: ICollaborationRequest) => void;
}

const classes = {
  item: css({
    padding: "8px 16px",
    cursor: "pointer",

    "& .ant-tag": {
      cursor: "pointer",
    },
  }),
};

const OrgsList: React.FC<IOrgsListProps> = (props) => {
  const {
    orgs,
    requests,
    selectedId,
    unseenChatsCountMapByOrg,
    onClickOrganization,
    onClickRequest,
  } = props;

  const requestStatusWeight: Record<CollaborationRequestStatusType, number> = {
    [CollaborationRequestStatusType.Pending]: 0,
    [CollaborationRequestStatusType.Accepted]: 1,
    [CollaborationRequestStatusType.Declined]: 2,
    [CollaborationRequestStatusType.Revoked]: 3,
    [CollaborationRequestStatusType.Expired]: 4,
  };

  const reqs = requests
    .sort((r1, r2) => {
      const s1 = getRequestStatus(r1);
      const s2 = getRequestStatus(r2);
      return requestStatusWeight[s1] - requestStatusWeight[s2];
    })
    .filter((r1) => {
      const s1 = getRequestStatus(r1);
      return s1 === CollaborationRequestStatusType.Pending;
    });

  if (orgs.length === 0 && requests.length === 0) {
    return <Message message="Create an organization to get started." />;
  }

  const wrap = (key: string, node: React.ReactNode, onClick: any) => {
    return (
      <StyledContainer
        key={key}
        s={{
          padding: "8px 16px",
          cursor: "pointer",

          "& .ant-tag": {
            cursor: "pointer",
          },
        }}
        onClick={onClick}
      >
        {node}
      </StyledContainer>
    );
  };

  let isPrevGroupRendered = false;
  const hasOrgs = orgs.length > 0;
  const hasRequests = reqs.length > 0;

  const renderOrgs = () => {
    if (!hasOrgs) {
      return (
        <Message
          className="flex-1"
          message={"Create an organization to get started."}
        />
      );
    }

    return (
      <div className="flex-1">
        {orgs.map((org) => {
          return (
            <BlockThumbnail
              key={org.customId}
              isSelected={selectedId === org.customId}
              block={org}
              className={classes.item}
              onClick={() => onClickOrganization(org)}
              showFields={["name", "description"]}
              unseenChatsCount={unseenChatsCountMapByOrg[org.customId]}
            />
          );
        })}
      </div>
    );
  };

  const renderRequests = () => {
    if (!hasRequests) {
      return (
        // <Message
        //   className="flex-1"
        //   message={"You don't have any requests yet."}
        // />
        null
      );
    }

    return (
      <div className="flex-1">
        {(isPrevGroupRendered = isPrevGroupRendered || reqs.length > 0) && (
          <Divider />
        )}
        <Typography.Text
          type="secondary"
          style={{ padding: "0 16px", textTransform: "uppercase" }}
        >
          Requests
        </Typography.Text>
        {reqs.map((request) => {
          return (
            <OrgCollaborationRequestThumbnail
              key={request.customId}
              onClick={() => onClickRequest(request)}
              collabRequest={request}
              isSelected={selectedId === request.customId}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={css({
        display: "flex",
        flex: 1,
        height: "100%",
        width: "100%",
        flexDirection: "column",
      })}
    >
      {renderOrgs()}
      {renderRequests()}
    </div>
  );
};

export default React.memo(OrgsList);
