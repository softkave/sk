import { Drawer, Dropdown } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";
import wrapMenu from "../utilities/wrapMenu";

export interface IMenuWithTriggerRenderMenuProps {
  closeMenu: () => void;
}

export interface IMenuWithTriggerRenderTriggerProps {
  openMenu: () => void;
}

export interface IMenuWithTriggerProps {
  menuType: "drawer" | "dropdown";
  renderTrigger: (props: IMenuWithTriggerRenderTriggerProps) => React.ReactNode;
  renderMenu: (
    props: IMenuWithTriggerRenderMenuProps
  ) => React.ReactNode | React.ReactElement;

  menuTitle?: React.ReactNode;
}

const MenuWithTrigger: React.FC<IMenuWithTriggerProps> = (props) => {
  const { menuType, renderMenu, renderTrigger, menuTitle } = props;
  const [showMenu, setShowMenu] = React.useState(false);
  const openMenu = () => setShowMenu(true);
  const closeMenu = () => setShowMenu(false);

  const renderOptionsDrawer = (
    title: React.ReactNode,
    onClose: () => void,
    renderContent: () => React.ReactNode
  ) => {
    return (
      <Drawer
        visible
        closable
        title={title}
        placement="right"
        onClose={onClose}
        width={300}
      >
        <StyledContainer
          s={{
            flexDirection: "column",
            width: "100%",
            flex: 1,
            alignItems: "center",
          }}
        >
          {renderContent()}
        </StyledContainer>
      </Drawer>
    );
  };

  const renderMenuForDrawer = () => {
    return (
      <React.Fragment>
        {renderTrigger({ openMenu })}
        {showMenu &&
          renderOptionsDrawer(menuTitle || "Options", closeMenu, () =>
            wrapMenu(renderMenu({ closeMenu }))
          )}
      </React.Fragment>
    );
  };

  const renderMenuForDropdown = () => {
    return (
      <Dropdown
        // @ts-ignore
        overlay={renderMenu({ closeMenu })}
        trigger={["click"]}
      >
        {renderTrigger({ openMenu })}
      </Dropdown>
    );
  };

  const render = () => {
    switch (menuType) {
      case "drawer":
        return renderMenuForDrawer();

      case "dropdown":
        return renderMenuForDropdown();

      default:
        return null;
    }
  };

  return render();
};

export default MenuWithTrigger;
