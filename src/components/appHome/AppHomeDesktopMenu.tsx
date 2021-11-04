import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Typography } from "antd";
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
                padding: "8px 16px",
                cursor: "pointer",
                borderTop: "1px solid rgb(223, 234, 240)",
                flexDirection: "column",
                width: "100%",
            }}
            onClick={() => setShowMenu(!showMenu)}
        >
            {showMenu && (
                <UserOptionsMenu
                    style={{
                        marginBottom: "8px",

                        [kAntMenuItemSelector]: {
                            // padding: 0,
                            lineHeight: "24px",
                            height: "auto",
                            padding: "8px 0px",
                            margin: 0,
                            marginBottom: "0px !important",
                        },

                        "& .ant-menu-item:first-of-type": {
                            paddingTop: 0,
                        },

                        [kAntMenuSelector]: {
                            width: "100%",
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
                        node: (
                            <Typography.Text type="secondary">
                                {showMenu ? (
                                    <CaretUpOutlined />
                                ) : (
                                    <CaretDownOutlined />
                                )}
                            </Typography.Text>
                        ),
                    },
                ]}
            />
        </StyledContainer>
    );
};

export default AppHomeDesktopMenu;
