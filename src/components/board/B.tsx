import React from "react";
import StyledContainer from "../styled/Container";
import BHeader2, { IBHeader2Props } from "./BHeader2";
import BResourceTypesTab, {
    IBResourceTypesTabProps,
} from "./BResourceTypesTab";

export type IBProps = IBHeader2Props & IBResourceTypesTabProps;

const B: React.FC<IBProps> = (props) => {
    return (
        <StyledContainer
            s={{ flexDirection: "column", flex: 1, width: "100%" }}
        >
            <BHeader2 {...props} />
            <BResourceTypesTab {...props} />
        </StyledContainer>
    );
};

export default React.memo(B);
