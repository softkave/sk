import React from "react";
import { SizeMeProps, withSize } from "react-sizeme";
import LayoutContainerInlineElements from "./LayoutContainerInlineElements";

export interface ILayoutElement {
  render: (props?: SizeMeProps["size"]) => React.ReactNode;
  flex?: number;
}

export interface ILayoutContainerProps {
  elements: ILayoutElement[];
  isHorizontal?: boolean;
  style?: React.CSSProperties;
}

const LayoutContainer: React.FC<ILayoutContainerProps & SizeMeProps> = (
  props
) => {
  const { elements, size, isHorizontal } = props;
  const [inlineElemsSize, setInlineElemsSize] = React.useState<
    SizeMeProps["size"] | null
  >(null);
  const elementsWithFlex: ILayoutElement[] = [];
  const inlineElements: ILayoutElement[] = [];
  const length = isHorizontal ? size.width : size.height;
  let rem: number = 0;
  let flexTotal = 0;

  if (length && inlineElemsSize) {
    const inlineElemsLength = isHorizontal
      ? inlineElemsSize.width
      : inlineElemsSize.height;

    if (inlineElemsLength) {
      rem = length - inlineElemsLength;
    }
  }

  elements.forEach((elem) => {
    if (elem.flex && elem.flex > 0) {
      elementsWithFlex.push(elem);
      flexTotal += elem.flex;
    } else {
      inlineElements.push(elem);
    }
  });

  const onInlineElementsSizeChange = React.useCallback(
    (inlineSizeProps: SizeMeProps["size"]) => {
      console.log("inline size changed");
      setInlineElemsSize(inlineSizeProps);
    },
    []
  );

  console.log({
    props,
    inlineElemsSize,
    rem,
    inlineElements,
    elementsWithFlex,
    flexTotal,
  });

  return (
    <div style={{ height: "100%" }}>
      <LayoutContainerInlineElements onSize={onInlineElementsSizeChange}>
        {inlineElements.map((elem) => elem.render())}
      </LayoutContainerInlineElements>
      {size &&
        inlineElemsSize &&
        elementsWithFlex.map((elem) => {
          let elemLength: number | null = null;

          if (elem.flex && rem) {
            elemLength = rem / (flexTotal / elem.flex);
          }

          let elemSize: SizeMeProps["size"] = {
            width: null,
            height: null,
          };

          if (isHorizontal) {
            elemSize = { width: elemLength, height: size.height };
          } else {
            elemSize = { width: size.width, height: elemLength };
          }

          return elem.render(elemSize);
        })}
    </div>
  );
};

export default withSize({ monitorHeight: true })(React.memo(LayoutContainer));
