import React from "react";
import { IBlock } from "../../models/block/block";
import ProjectList from "../project/ProjectList";
import LoadBlockChildren from "./LoadBlockChildren";

export interface ILoadBlockProjectsProps {
  block: IBlock;
  onClickBlock: (blocks: IBlock[]) => void;
}

const LoadBlockProjects: React.FC<ILoadBlockProjectsProps> = props => {
  const { block, onClickBlock } = props;

  const renderProjects = () => {
    return (
      <LoadBlockChildren
        parent={block}
        getChildrenIDs={() => block.projects || []}
        render={projects => (
          <ProjectList
            projects={projects}
            onClick={project => onClickBlock([project])}
          />
        )}
      />
    );
  };

  return renderProjects();
};

export default LoadBlockProjects;
