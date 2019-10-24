import styled from "@emotion/styled";
import React from "react";
import { IBlock } from "../../models/block/block";
import Thumbnail from "../thumbnail/Thumbnail";

export interface IProjectThumbnailProps {
  project: IBlock;
  onClick: () => void;
  className?: string;
}

const ProjectThumbnail: React.SFC<IProjectThumbnailProps> = props => {
  const { project, onClick, className } = props;
  return (
    <StyledThumbnail
      data={project}
      onClick={onClick}
      renderInfo={() => {
        return <h3>{project.name}</h3>;
      }}
      className={className}
    />
  );
};

export default ProjectThumbnail;

const StyledThumbnail = styled(Thumbnail)({
  cursor: "pointer"
});
