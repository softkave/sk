import { css, cx } from "@emotion/css";
import { Divider } from "antd";
import { isString } from "lodash";
import React from "react";
import { appClassNames } from "../../classNames";
import Message from "../../PageMessage";
import { IStyleableComponent } from "../styling/types";

export interface IItemListExportedProps extends IStyleableComponent {
  emptyMessage?: string | React.ReactNode;
  bordered?: boolean;
  padEmptyMessage?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  emptyClassName?: string;
  emptyStyle?: React.CSSProperties;
}

export interface IItemListProps<T = any> extends IItemListExportedProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getId?: (item: T, index: number) => string;
}

const classes = {
  root: css({
    "& .ant-divider": {
      margin: "0px !important",
    },
  }),
};

function ItemList<T>(props: IItemListProps<T>) {
  const {
    items,
    emptyMessage,
    bordered,
    borderTop,
    borderBottom,
    padEmptyMessage,
    className,
    emptyClassName,
    emptyStyle,
    style,
    renderItem,
    getId,
  } = props;
  const _renderItem = (item: T, index: number) => {
    const node = renderItem(item, index);
    return bordered && (borderBottom || index !== items.length - 1) ? (
      <React.Fragment key={getId ? getId(item, index) : index}>
        {node}
        <Divider />
      </React.Fragment>
    ) : (
      node
    );
  };

  if (items.length === 0) {
    return isString(emptyMessage) ? (
      <Message
        shouldPad={padEmptyMessage}
        message={emptyMessage}
        className={emptyClassName}
        style={emptyStyle}
      />
    ) : (
      emptyMessage
    );
  }

  return (
    <div style={style} className={cx(className, appClassNames.pageListRoot, classes.root)}>
      {borderTop && <Divider />}
      {items.map(_renderItem)}
    </div>
  );
}

export default ItemList as React.FC<IItemListProps>;
