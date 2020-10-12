import styled from "@emotion/styled";
import { Tag, Typography } from "antd";
import React from "react";

const Pricing: React.FC<{}> = () => {
    return (
        <PricingContainer>
            <Typography.Paragraph>
                <Typography.Text>Softkave</Typography.Text> is{" "}
                <Tag color="#7ED321">free</Tag> for your{" "}
                <Tag color="#7ED321">first year</Tag>
            </Typography.Paragraph>
        </PricingContainer>
    );
};

export default Pricing;

const PricingContainer = styled.div({
    display: "flex",
    height: "100%",
    padding: "16px",
    alignItems: "center",
});
