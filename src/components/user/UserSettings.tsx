import { Tabs } from "antd";
import React from "react";
import NotificationSettingsContainer from "./NotificationSettingsContainer";
import UpdateUserDataFormContainer from "./UpdateUserDataFormContainer";

export interface IUserSettingsProps {}

const UserSettings: React.FC<IUserSettingsProps> = (props) => {
    return (
        <Tabs>
            <Tabs.TabPane tab="Profile">
                <UpdateUserDataFormContainer />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Notifications">
                <NotificationSettingsContainer />
            </Tabs.TabPane>
        </Tabs>
    );
};

export default UserSettings;
