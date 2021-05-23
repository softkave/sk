import { css } from "@emotion/css";
import { Tabs } from "antd";
import React from "react";
import NotificationSettingsContainer from "./NotificationSettingsContainer";
import UpdateUserDataFormContainer from "./UpdateUserDataFormContainer";

export interface IUserSettingsProps {}

const UserSettings: React.FC<IUserSettingsProps> = (props) => {
    return (
        <div
            className={css({
                flex: 1,
            })}
        >
            <Tabs
                defaultActiveKey="profile"
                tabBarExtraContent={{
                    left: (
                        <span
                            className={css({
                                marginLeft: "16px",
                                display: "inline-block",
                            })}
                        ></span>
                    ),
                }}
            >
                <Tabs.TabPane tab="Profile" key="profile">
                    <UpdateUserDataFormContainer />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Notifications" key="notifications">
                    <NotificationSettingsContainer />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default UserSettings;
