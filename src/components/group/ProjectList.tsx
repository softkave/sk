import styled from "@emotion/styled";
import React from "react";

import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import ScrollList from "../../ScrollList";
import { IBlockMethods } from "../methods.js";
import ProjectThumbnail from "../project/ProjectThumbnail";

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
    return (
      <ScrollList>
        <Projects>{this.renderProjects()}</Projects>
      </ScrollList>
    );
  }
}

const BlockThumbnailContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Projects = styled.div`
  padding: 0 12px;
`;

export default ProjectList;
