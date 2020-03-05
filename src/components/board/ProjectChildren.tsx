import React from "react";
import { IBlock } from "../../models/block/block";
import ProjectList from "../project/ProjectList";
import BoardBlockChildren from "./LoadBlockChildren";

export interface IProjectChildrenProps {
  block: IBlock;
  onClickBlock: (blocks: IBlock[]) => void;
}

const ProjectChildren: React.FC<IProjectChildrenProps> = props => {
  const { block, onClickBlock } = props;

  const renderProjects = () => {
    return (
      <BoardBlockChildren
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

export default ProjectChildren;
