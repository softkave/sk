import styled from "@emotion/styled";
import { Col, Dropdown, Menu, Row } from "antd";
import React from "react";
import { SizeMe } from "react-sizeme";
import ItemAvatar from "../ItemAvatar";

export interface IAvatarItem {
  color?: string;
  extra?: React.ReactNode;
  active?: boolean;
  key: any;
}

export interface IAvatarListProps {
  collaborators?: IAvatarItem[];
  onClick?: (avatar: IAvatarItem, selected: boolean) => void;
}

const avatarWidthPx = 32;
const avatarMarginPx = 8;

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

          return (
            <StyledAvatarListContainer>
              {this.renderAvatars(avatars!.slice(0, renderAvatarNum))}
              {this.renderHiddenButton(avatars!.slice(renderAvatarNum))}
            </StyledAvatarListContainer>
          );
        }}
      </SizeMe>
    );
  }

  private getRenderNum(displayWidth: number = 32) {
    const avatarLayoutXPx = avatarWidthPx + avatarMarginPx;

    return Math.floor((displayWidth - avatarWidthPx) / avatarLayoutXPx) + 1;
  }

  private renderAvatar(avatar: IAvatarItem, renderExtra = false) {
    const { onClick } = this.props;

    const renderedAvatar = (
      <ItemAvatar
        clickable
        color={avatar.color}
        active={avatar.active}
        onClick={() => onClick!(avatar, !avatar.active)}
      />
    );

    if (renderExtra) {
      return (
        <Row key={avatar.key} align="middle">
          <Col span={4}>{renderedAvatar}</Col>
          <Col span={20}>{avatar.extra}</Col>
        </Row>
      );
    } else {
      return (
        <StyledAvatarContainer key={avatar.key}>
          {renderedAvatar}
        </StyledAvatarContainer>
      );
    }
  }

  private renderAvatars(avatars: IAvatarItem[], renderExtra = false) {
    return avatars.map(avatar => {
      return this.renderAvatar(avatar, renderExtra);
    });
  }

  private renderHiddenButton(avatars: IAvatarItem[]) {
    if (avatars.length > 0) {
      const menu = (
        <StyledMenu>
          {avatars.map(avatar => {
            return (
              <Menu.Item key={avatar.key}>
                {this.renderAvatar(avatar, true)}
              </Menu.Item>
            );
          })}
        </StyledMenu>
      );

      return (
        <Dropdown overlay={menu}>
          <StyledMoreButtonContainer>
            <ItemAvatar>{avatars.length} +</ItemAvatar>
          </StyledMoreButtonContainer>
        </Dropdown>
      );
    }

    return null;
  }
}

const StyledAvatarListContainer = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 40px;
`;

const StyledAvatarContainer = styled.div`
  display: inline-block;
  margin-right: ${avatarMarginPx}px;
`;

const StyledMoreButtonContainer = styled.div`
  display: inline-block;
  cursor: pointer;
  font-size: 18px;
`;

const StyledMenu = styled(Menu)({
  minWidth: 300
});
