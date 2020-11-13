import styled from "@emotion/styled";
import React from "react";
import RenderForDevice from "../../components/RenderForDevice";
import seedDemoData from "../../models/seedDemoData";
import { getWindowHeight, getWindowWidth } from "../../utils/window";
import BoardsCard from "./cards/BoardsCard";
import ChatCard from "./cards/ChatCard";
import CollaboratorsCard from "./cards/CollaboratorsCard";
import OrgsCard from "./cards/OrgsCard";
import TasksCard from "./cards/TasksCard";

const Middle: React.FC<{}> = () => {
    const [seedData] = React.useState(seedDemoData());

    const r = (style: React.CSSProperties) => {
        return (
            <MiddleContainer>
                {/* <CardContainer style={style}>
                    <OrgsCard org={seedData.web.org} />
                </CardContainer>
                <CardContainer style={style}>
                    <CollaboratorsCard request={seedData.web.request} />
                </CardContainer>

                <CardContainer style={style}>
                    <BoardsCard board={seedData.web.board} />
                </CardContainer> */}
                <CardContainer style={style}>
                    <TasksCard
                        demo
                        board={seedData.web.board}
                        labelList={seedData.web.labelList}
                        collaborators={seedData.web.orgUsers}
                        resolutionsList={seedData.web.resolutionsList}
                        statusList={seedData.web.statusList}
                        task={seedData.web.task}
                        user={seedData.web.user}
                        sprints={[]} // TODO: seed
                        sprintsMap={{}}
                    />
                </CardContainer>
                <CardContainer style={style}>
                    <ChatCard
                        room={seedData.web.room}
                        recipient={seedData.web.recipient}
                    />
                </CardContainer>
            </MiddleContainer>
        );
    };

    return (
        <RenderForDevice
            renderForDesktop={() =>
                r({
                    // width: getWindowWidth() / 2 - 16,
                    width: "50%",
                    // height: getWindowHeight() / 2 - 16,
                })
            }
            renderForMobile={() =>
                r({
                    width: "100%",
                    height: getWindowHeight(),
                })
            }
        />
    );
};

export default Middle;

const CardContainer = styled.div({
    // display: "flex",
    flex: 1,
    alignItems: "center",
    display: "inline-block",
});

const MiddleContainer = styled.div({
    // display: "flex",
    // minHeight: "100%",
    padding: "16px",
    paddingBottom: "128px",
    // alignItems: "center",
});
