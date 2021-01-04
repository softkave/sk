import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { noop } from "lodash";
import React from "react";
import { IUser } from "../../models/user/user";
import UserAvatar from "../collaborator/UserAvatar";
import StyledContainer from "../styled/Container";
import SpaceOut from "../utilities/SpaceOut";
import UserOptionsMenu, { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeDesktopMenuProps {
    user: IUser;
    onSelect: (key: UserOptionsMenuKeys) => void;
}

const kAntMenuItemSelector = "& .ant-menu-item";
const kAntMenuSelector = "& .ant-menu";

const AppHomeDesktopMenu: React.FC<IAppHomeDesktopMenuProps> = (props) => {
    const { user, onSelect } = props;

    const [showMenu, setShowMenu] = React.useState(false);

    return (
        <StyledContainer
            s={{
                padding: "16px",
                cursor: "pointer",
                borderTop: "1px solid #d9d9d9",
                flexDirection: "column",
                width: "100%",
            }}
            onClick={() => setShowMenu(!showMenu)}
        >
            {showMenu && (
                <UserOptionsMenu
                    style={{
                        marginBottom: "12px",

                        [kAntMenuItemSelector]: {
                            padding: 0,
                        },

                        [kAntMenuSelector]: {
                            width: "100%",
                            // backgroundColor: "#fafafa",
                        },
                    }}
                    onSelect={onSelect}
                />
            )}
            <SpaceOut
                size="middle"
                content={[
                    {
                        node: (
                            <UserAvatar clickable user={user} onClick={noop} />
                        ),
                    },
                    {
                        node: user.name,
                        style: {
                            flex: 1,
                        },
                    },
                    {
                        node: showMenu ? (
                            <CaretUpOutlined />
                        ) : (
                            <CaretDownOutlined />
                        ),
                    },
                ]}
            />
        </StyledContainer>
    );
};

export default AppHomeDesktopMenu;
