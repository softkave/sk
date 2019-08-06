import styled from "@emotion/styled";
import { Avatar, Checkbox, Col, Dropdown, Menu, Row } from "antd";
import React from "react";
import { SizeMe } from "react-sizeme";

import SkAvatar from "../SkAvatar";

interface IAvatarItem {
  color?: string;
  extra?: React.ReactNode;
  active?: boolean;
}

export interface IAvatarListProps {
  collaborators?: IAvatarItem[];
  clickable?: boolean;
  onClick?: (avatar: IAvatarItem, selected: boolean) => void;
}

const avatarWidthPx = 32;
const avatarMarginPx = 16;

export default class AvatarList extends React.Component<IAvatarListProps> {
  public static defaultProps = {
    avatars: [],
    onClick: () => null
  };

  public render() {
    const { collaborators: avatars } = this.props;

    return (
      <SizeMe>
        {({ size }) => {
          const renderNum = this.getRenderNum(size.width!);
          const renderAvatarNum = renderNum - 1;
          const hiddenAvatarNum = avatars!.length - renderAvatarNum;

          return (
            <AvatarListContainer>
              {this.renderAvatars(avatars!.slice(0, renderNum - 1))}
              <MoreButtonContainer>
                <SkAvatar>{hiddenAvatarNum}+</SkAvatar>
              </MoreButtonContainer>
            </AvatarListContainer>
          );
        }}
      </SizeMe>
    );
  }

  private getRenderNum(displayWidth: number = 32) {
    const avatarLayoutXPx = avatarWidthPx + avatarMarginPx;

    return Math.floor((displayWidth - avatarWidthPx) / avatarLayoutXPx) + 1;
  }

  private renderAvatars(avatars: IAvatarItem[], renderExtra = false) {
    const { onClick } = this.props;

    return avatars.map(avatar => {
      const renderedAvatar = (
        <SkAvatar
          clickable
          color={avatar.color}
          active={avatar.active}
          onClick={() => onClick!(avatar, !avatar.active)}
        />
      );

      if (renderExtra) {
        return (
          <Row>
            <Col span={4}>
              <Checkbox
                onChange={event => onClick!(avatar, event.target.checked)}
              />
            </Col>
            <Col span={8}>{renderedAvatar}</Col>
            <Col span={12}>{avatar.extra}</Col>
          </Row>
        );
      } else {
        return <AvatarContainer>{renderedAvatar}</AvatarContainer>;
      }
    });
  }

  private renderHiddenAvatars(avatars: IAvatarItem[]) {
    return (
      <HiddenAvatarContainer>
        {this.renderAvatars(avatars, true)}
      </HiddenAvatarContainer>
    );
  }
}

const AvatarListContainer = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const AvatarContainer = styled.div`
  display: inline-block;
  margin-left: 16px;

  &:first-of-type {
    margin-left: 0;
  }
`;

const MoreButtonContainer = styled.div`
  display: inline-block;
  margin-left: 16px;
  cursor: pointer;
  font-size: 18px;
`;

const HiddenAvatarContainer = styled.div`
  padding: 16px;
`;
