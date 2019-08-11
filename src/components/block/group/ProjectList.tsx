import styled from "@emotion/styled";
import React from "react";

import { IBlock } from "../../../models/block/block.js";
import { IUser } from "../../../models/user/user";
import { IBlockMethods } from "../methods.js";
import ProjectThumbnail from "../project/ProjectThumbnail";
import ScrollList from "./ScrollList.jsx";

export interface IProjectListProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  projects: IBlock[];
  setCurrentProject: (project: IBlock) => void;
}

class ProjectList extends React.PureComponent<IProjectListProps> {
  public renderProjects() {
    const { setCurrentProject, projects } = this.props;
    const projectsToRender = projects;
    const renderedProjects = projectsToRender.map(project => {
      return (
        <BlockThumbnailContainer key={project.customId}>
          <ProjectThumbnail
            project={project}
            onClick={() => setCurrentProject(project)}
          />
        </BlockThumbnailContainer>
      );
    });

    return renderedProjects;
  }

  public render() {
    return <ScrollList>{this.renderProjects()}</ScrollList>;
  }
}

const BlockThumbnailContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

export default ProjectList;
