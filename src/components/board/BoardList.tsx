import { cx } from "@emotion/css";
import { isFunction } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { SystemResourceType } from "../../models/app/types";
import { IBoard } from "../../models/board/types";
import MapsSelectors from "../../redux/maps/selectors";
import { IAppState } from "../../redux/types";
import { appClassNames } from "../classNames";
import ItemList from "../utils/list/ItemList";
import { IItemListLikeComponentProps } from "../utils/list/types";
import BoardThumnail, { IBoardThumbnailProps } from "./BoardThumnail";

export interface IBoardListProps
  extends Pick<IBoardThumbnailProps, "selectable" | "withCheckbox">,
    IItemListLikeComponentProps {
  ids?: string[];
  items?: IBoard[];
  onClick?: (item: IBoard) => void;
  selected?: Record<string, boolean>;
  emptyMessage?: React.ReactNode;
  onSelect?: (id: string, checked: boolean, board: IBoard) => void;
}

const BoardList: React.FC<IBoardListProps> = (props) => {
  const { ids, selected, emptyMessage, items, itemClassName, padItems, menu, onSelect, onClick } =
    props;
  const boards = useSelector<IAppState, IBoard[]>(
    (state) => items || (ids ? MapsSelectors.getList(state, SystemResourceType.Board, ids) : [])
  );

  const renderItem = (item: IBoard) => {
    return (
      <BoardThumnail
        {...props}
        key={item.customId}
        board={item}
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
      items={boards}
      emptyMessage={emptyMessage || "Add a board to get started"}
      renderItem={renderItem}
    />
  );
};

export default BoardList;
