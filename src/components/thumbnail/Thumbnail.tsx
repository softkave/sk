import styled from "@emotion/styled";
import { Col, Row } from "antd";
import React from "react";

import { IAnyObject } from "../../utils/types";

const defaultThumbnailColor = "#aaa";
const defaultColorSpan = 6;

interface IThumbnailData extends IAnyObject {
  color?: string;
}

export interface IThumbnailProps {
  data: IThumbnailData;
  renderInfo: (data: IThumbnailData, props: IThumbnailProps) => React.ReactNode;
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
  colorStyle?: React.CSSProperties;
  colorClassName?: string;
  color?: string;
}

const Thumbnail: React.SFC<IThumbnailProps> = props => {
  const {
    data,
    renderInfo,
    onClick,
    className,
    style,
    colorStyle,
    colorClassName,
    color
  } = props;
  const thumbnailColor = data.color || color;

  return (
    <StyledThumnail className={className} style={style} onClick={onClick}>
      <StyledRow gutter={16}>
        <StyledColorCol span={defaultColorSpan}>
          <StyledThumnailColor
            style={{ backgroundColor: thumbnailColor, ...colorStyle }}
            className={colorClassName}
          />
        </StyledColorCol>
        <StyledContentCol span={24 - defaultColorSpan!}>
          {renderInfo(data, props)}
        </StyledContentCol>
      </StyledRow>
    </StyledThumnail>
  );
};

Thumbnail.defaultProps = {
  color: defaultThumbnailColor
};

export default Thumbnail;

const StyledThumnail = styled.div`
  padding: 14px;
  box-sizing: border-box;
  height: 100%;
  min-height: 60px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  width: 100%;
  line-height: 24px;
  padding: 4px;
  box-sizing: border-box;
`;

const StyledRow = styled(Row)({
  height: "100%"
});

const StyledColorCol = styled(Col)({
  height: 60
});

const StyledContentCol = styled(Col)({
  height: "100%"
});

const StyledThumnailColor = styled.div`
  height: 100%;
  min-height: 100%;
  max-height: 80px;
  display: inline-block;
  width: 100%;
  border-radius: 4px;
`;
