import React from "react";
import { SizeMe } from "react-sizeme";

export interface ICloneWithWidthOptions {
  marginLeft?: number;
  marginRight?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

const cloneWithWidth = (
  node: React.ReactElement,
  options: ICloneWithWidthOptions = {}
): React.ReactNode => {
  const marginLeft = options.marginLeft || 0;
  const marginRight = options.marginRight || 0;
  const paddingLeft = options.paddingLeft || 0;
  const paddingRight = options.paddingRight || 0;
  const total = marginLeft + marginRight + paddingLeft + paddingRight;

  return (
    <SizeMe>
      {({ size }) => {
        return React.cloneElement(node, {
          style: {
            width: size.width ? size.width - total : size.width!,
          },
        });
      }}
    </SizeMe>
  );
};

export default cloneWithWidth;
