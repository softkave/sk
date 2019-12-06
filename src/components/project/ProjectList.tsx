import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";

export interface IProjectListProps {
  projects: IBlock[];
  onClick?: (project: IBlock) => void; 
}

const ProjectList: React.FC<IProjectListProps> = props => {
  const { onClick, projects } = props;

  return (
    <BlockList
      blocks={projects}
      onClick={onClick}
      showFields={["name"]}
      emptyDescription="No projects available."
      itemStyle={{ padding: "16px" }}
    />
  );
};

export default ProjectList;
