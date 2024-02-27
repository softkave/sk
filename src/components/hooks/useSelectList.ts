import { isArray, isFunction } from "lodash";
import React from "react";
import { indexArray } from "../../utils/utils";

export interface IUseSelectListProps {
  defaultSelected?: string[] | Record<string, boolean> | (() => Record<string, boolean>);
}

export function useSelectList(props: IUseSelectListProps) {
  const { defaultSelected } = props;
  const [selected, setSelected] = React.useState<Record<string, boolean>>(
    isArray(defaultSelected)
      ? () => indexArray(defaultSelected)
      : isFunction(defaultSelected)
      ? defaultSelected
      : {}
  );
  const onSelect = React.useCallback((id: string, selected: boolean) => {
    setSelected((state) => {
      return { ...state, [id]: selected };
    });
  }, []);

  return {
    selected,
    onSelect,
    getList: () => {
      const selectedList: string[] = [];
      for (const k in selected) {
        if (selected[k]) selectedList.push(k);
      }
      return selectedList;
    },
  };
}
