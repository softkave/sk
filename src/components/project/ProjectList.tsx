import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";
import StyledFlexColumnContainer from "../styled/ColumnContainer";

export interface IProjectListProps {
  projects: IBlock[];
  onClick?: (project: IBlock) => void;
}

const ProjectList: React.FC<IProjectListProps> = props => {
  const { onClick, projects } = props;

  return (
    <StyledFlexColumnContainer>
      <h1>Projects</h1>
      <BlockList
        blocks={projects}
        onClick={onClick}
        showFields={["name"]}
        emptyDescription="No projects available."
        itemStyle={{ padding: "16px 0" }}
      />
    </StyledFlexColumnContainer>
  );
};

export default ProjectList;
