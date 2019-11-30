import styled from "@emotion/styled";
import { Icon } from "antd";
import React from "react";
import StyledCenterContainer from "./styled/CenterContainer";
import StyledFlexFillContainer from "./styled/FillContainer";

export interface ILoadingProps {
  fontSize?: string | number;
}

const Loading: React.SFC<ILoadingProps> = props => {
  console.log(props);
  return (
    <StyledFlexFillContainer>
      <StyledCenterContainer>
        <StyledIcon type="loading" {...props} />
      </StyledCenterContainer>
    </StyledFlexFillContainer>
  );
};

Loading.defaultProps = {
  fontSize: "50px"
};

export default Loading;

const StyledIcon = styled(Icon)<ILoadingProps>(props => ({
  fontSize: props.fontSize,
  color: "rgb(66,133,244)"
}));
