import React from "react";
import { IUser } from "../../models/user/user";
import { SizeMe } from "react-sizeme";
import StyledContainer from "../styled/Container";
import ItemAvatar from "../ItemAvatar";
import { Space, Typography } from "antd";

export interface IPermissionGroupUserAvatarsProps {
    users: IUser[];
}

const kMargin = 8;
const kAvatarWidth = 24;
const kTotalAvatarWidth = kAvatarWidth + kMargin;
const kDefaultContainerWidth = 1;

const PermissionGroupUserAvatars: React.FC<IPermissionGroupUserAvatarsProps> = (
    props
) => {
    const { users } = props;
    const [showAll, setShowAll] = React.useState(false);

    const toggleShowAll = React.useCallback(() => {
        setShowAll(!showAll);
    }, [showAll]);

    const renderAvatars = (width = kDefaultContainerWidth) => {
        const max = showAll
            ? users.length
            : Math.floor((width - kAvatarWidth) / kTotalAvatarWidth);

        const nodes = users.slice(0, max).map((user) => (
            <StyledContainer key={user.customId} s={{ marginRight: kMargin }}>
                <ItemAvatar color={user.color} />
            </StyledContainer>
        ));

        if (nodes.length !== users.length) {
            nodes.push(
                <ItemAvatar key="show-more" onClick={toggleShowAll}>
                    +{users.length - nodes.length}
                </ItemAvatar>
            );
        }

        return nodes;
    };

    if (users.length === 0) {
        return <span />;
    }

    return (
        <Space>
            <SizeMe monitorWidth>
                {(size) => (
                    <StyledContainer>
                        {renderAvatars(
                            size.size.width || kDefaultContainerWidth
                        )}
                    </StyledContainer>
                )}
            </SizeMe>
            <StyledContainer>
                <Typography.Text>3 more</Typography.Text>
                <Typography.Text>+ Add user</Typography.Text>
            </StyledContainer>
        </Space>
    );
};

export default PermissionGroupUserAvatars;
