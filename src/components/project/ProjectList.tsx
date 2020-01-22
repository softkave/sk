import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";
import StyledContainer from "../styled/Container";

export interface IProjectListProps {
  projects: IBlock[];
  onClick?: (project: IBlock) => void;
}

const ProjectList: React.FC<IProjectListProps> = props => {
  const { onClick, projects } = props;

  return (
    <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
      <BlockList
        blocks={projects}
        onClick={onClick}
        showFields={["name"]}
        emptyDescription="No projects available."
      />
    </StyledContainer>
  );
};

export default ProjectList;
