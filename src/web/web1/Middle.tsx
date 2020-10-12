import styled from "@emotion/styled";
import React from "react";
import BoardsCard from "./cards/BoardsCard";
import ChatCard from "./cards/ChatCard";
import CollaboratorsCard from "./cards/CollaboratorsCard";
import OrgsCard from "./cards/OrgsCard";
import TasksCard from "./cards/TasksCard";

const Middle: React.FC<{}> = () => {
    return (
        <MiddleContainer>
            <CardContainer>
                <OrgsCard />
            </CardContainer>
            <CardContainer>
                <CollaboratorsCard />
            </CardContainer>
            <CardContainer>
                <ChatCard />
            </CardContainer>
            <CardContainer>
                <BoardsCard />
            </CardContainer>
            <CardContainer>
                <TasksCard />
            </CardContainer>
        </MiddleContainer>
    );
};

export default Middle;

const CardContainer = styled.div({
    display: "flex",
    flex: 1,
});

const MiddleContainer = styled.div({
    display: "flex",
    height: "100%",
    padding: "16px",
    alignItems: "center",
});
