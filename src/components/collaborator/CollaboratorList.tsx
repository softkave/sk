import { cx } from "@emotion/css";
import { isFunction } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { SystemResourceType } from "../../models/app/types";
import { ICollaborator } from "../../models/collaborator/types";
import MapsSelectors from "../../redux/maps/selectors";
import { IAppState } from "../../redux/types";
import { appClassNames } from "../classNames";
import ItemList, { IItemListExportedProps } from "../utils/list/ItemList";
import { IItemListLikeComponentProps } from "../utils/list/types";
import CollaboratorThumbnail, { ICollaboratorThumbnailProps } from "./CollaboratorThumbnail";

export interface ICollaboratorListProps
  extends Pick<ICollaboratorThumbnailProps, "selectable" | "withCheckbox">,
    IItemListLikeComponentProps<ICollaborator>,
    IItemListExportedProps {
  ids?: string[];
  items?: ICollaborator[];
  onClick?: (item: ICollaborator) => void;
  selected?: Record<string, boolean>;
  emptyMessage?: React.ReactNode;
  onSelect?: (id: string, checked: boolean, collaborator: ICollaborator) => void;
}

const CollaboratorList: React.FC<ICollaboratorListProps> = (props) => {
  const {
    ids,
    selected,
    emptyMessage,
    items,
    itemClassName,
    padItems,
    selectable,
    withCheckbox,
    menu,
    onSelect,
    onClick,
  } = props;
  const collaborators = useSelector<IAppState, ICollaborator[]>(
    (state) => items || (ids ? MapsSelectors.getList(state, SystemResourceType.User, ids) : [])
  );

  const renderItem = (item: ICollaborator) => {
    return (
      <CollaboratorThumbnail
        {...props}
        selectable={selectable}
        withCheckbox={withCheckbox}
        key={item.customId}
        collaborator={item}
        className={cx(itemClassName, padItems && appClassNames.item)}
        selected={selected && selected[item.customId]}
        onSelect={onSelect && ((checked) => onSelect(item.customId, checked, item))}
        onClick={onClick && (() => onClick(item))}
        menu={isFunction(menu) ? menu(item) : menu}
      />
    );
  };

  return (
    <ItemList
      {...props}
      items={collaborators}
      emptyMessage={emptyMessage || "Add a collaborator to get started"}
      renderItem={renderItem}
    />
  );
};

export default CollaboratorList;
