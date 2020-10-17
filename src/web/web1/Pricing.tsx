import styled from "@emotion/styled";
import { Tag, Typography } from "antd";
import React from "react";

const Pricing: React.FC<{}> = () => {
    return (
        <PricingContainer>
            <Typography.Text strong>Pricing</Typography.Text>
            <Typography.Paragraph>
                <Typography.Text>Softkave</Typography.Text> is{" "}
                <Tag color="#7ED321">free</Tag> for your{" "}
                <Tag color="#7ED321">first year</Tag>. After that, it's $1 per
                user per month.
            </Typography.Paragraph>
        </PricingContainer>
    );
};

export default Pricing;

const PricingContainer = styled.div({
    display: "flex",
    padding: "16px",
    paddingBottom: "128px",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
});
