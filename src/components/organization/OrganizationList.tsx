import React from "react";
import { IAppOrganization } from "../../models/organization/types";
import { IUnseenChatsCountByOrg } from "../../redux/key-value/types";
import BlockThumbnail from "../block/BlockThumnail";
import { appClassNames } from "../classNames";
import Message from "../Message";

export interface IOrganizationListProps {
  organizations: IAppOrganization[];
  unseenChatsCountMapByOrg: IUnseenChatsCountByOrg;
  selectedId?: string;
  onClickOrganization: (block: IAppOrganization) => void;
}

const OrganizationList: React.FC<IOrganizationListProps> = (props) => {
  const {
    organizations,
    selectedId,
    unseenChatsCountMapByOrg,
    onClickOrganization,
  } = props;

  if (organizations.length === 0) {
    return <Message message="Create an organization to get started." />;
  }

  return (
    <div className={appClassNames.pageListRoot}>
      {organizations.map((organization) => {
        return (
          <BlockThumbnail
            key={organization.customId}
            isSelected={selectedId === organization.customId}
            block={organization}
            className={appClassNames.pageListItem}
            onClick={() => onClickOrganization(organization)}
            showFields={["name"]}
            unseenChatsCount={unseenChatsCountMapByOrg[organization.customId]}
          />
        );
      })}
    </div>
  );
};

export default React.memo(OrganizationList);
