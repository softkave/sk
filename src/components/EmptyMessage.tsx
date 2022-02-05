import { Empty } from "antd";
import React from "react";
import StyledContainer from "./styled/Container";

export interface IEmptyMessageProps {
  className?: string;
  style?: React.CSSProperties;
}

const EmptyMessage: React.FC<IEmptyMessageProps> = (props) => {
  const { children, className, style } = props;
  return (
    <StyledContainer
      s={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
      style={style}
      className={className}
    >
      <Empty description={children} />
    </StyledContainer>
  );
};

export default EmptyMessage;
