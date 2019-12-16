import React from "react";
import { IBlock } from "../../models/block/block";
import BlockList from "../block/BlockList";

export interface IProjectListProps {
  projects: IBlock[];
  setCurrentProject: (project: IBlock) => void;
}

const ProjectList: React.SFC<IProjectListProps> = props => {
  const { setCurrentProject, projects } = props;

  return (
    <BlockList
      blocks={projects}
      onClick={setCurrentProject}
      showFields={["name"]}
      emptyDescription="No projects available."
      itemStyle={{ padding: "16px" }}
    />
  );
};

export default ProjectList;
