import { css } from "@emotion/css";
import { Divider, Tabs } from "antd";
import React from "react";
import ChangePasswordFormContainer from "./ChangePasswordFormContainer";
import NotificationSettingsContainer from "./NotificationSettingsContainer";
import UpdateUserDataFormContainer from "./UpdateUserDataFormContainer";

export interface IUserSettingsProps {}

const kAntTabsSelector = "& .ant-tabs";
const kAntTabsContentSelector = "& .ant-tabs-content";
const kAntTabsNavSelector = "& .ant-tabs-nav";
const kAntTabsTabPane = "& .ant-tabs-tabpane";

const UserSettings: React.FC<IUserSettingsProps> = (props) => {
    return (
        <div
            className={css({
                flex: 1,

                [kAntTabsSelector]: {
                    height: "100%",
                },

                [kAntTabsContentSelector]: {
                    height: "100%",
                },

                [kAntTabsNavSelector]: {
                    marginBottom: "0px",
                },

                [kAntTabsTabPane]: {
                    overflow: "auto",
                },
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
                    <Divider />
                    <ChangePasswordFormContainer />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Notifications" key="notifications">
                    <NotificationSettingsContainer />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default UserSettings;
