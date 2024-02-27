import { cx } from "@emotion/css";
import React from "react";
import { IAppWorkspace } from "../../models/organization/types";
import { indexByCustomId } from "../../utils/utils";
import Message from "../PageMessage";
import BlockThumbnail from "../block/BlockThumnail";
import { appClassNames } from "../classNames";
import ItemList from "../utils/list/ItemList";
import { IItemListLikeComponentProps } from "../utils/list/types";

export interface IWorkspaceListProps extends IItemListLikeComponentProps {
  organizations: IAppWorkspace[];
  selectedId?: string;
  selectable?: boolean;
  onClickOrganization: (block: IAppWorkspace) => void;
}

const OrganizationList: React.FC<IWorkspaceListProps> = (props) => {
  const { organizations, selectedId, padItems, itemClassName, selectable, onClickOrganization } =
    props;
  if (organizations.length === 0) {
    return <Message message="Create an organization to get started" />;
  }

  return (
    <div className={appClassNames.pageListRoot}>
      <ItemList
        // bordered
        borderTop
        borderBottom
        items={organizations}
        renderItem={(organization) => {
          return (
            <BlockThumbnail
              showName
              key={organization.customId}
              isSelected={selectedId === organization.customId}
              block={organization}
              className={cx(
                itemClassName,
                padItems && appClassNames.item,
                selectable && appClassNames.selectable
              )}
              onClick={() => onClickOrganization(organization)}
              unseenChatsCount={organization.unseenChatsCount}
            />
          );
        }}
        getId={indexByCustomId}
      />
    </div>
  );
};

export default React.memo(OrganizationList);
