import { Button, Space } from "antd";
import React from "react";

export interface IIconLinkProps {
    icon: React.ReactNode;
    text: string;
    href: string;
}

const IconLink: React.FC<IIconLinkProps> = (props) => {
    const { icon, text, href } = props;

    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            <Space>
                <Button style={{ cursor: "pointer" }} className="icon-btn">
                    {icon}
                </Button>
                {text}
            </Space>
        </a>
    );
};

export default IconLink;
