import React from "react";

import Thumbnail from "../thumbnail/Thumbnail";
import "./project-thumbnail.css";

export default function ProjectThumbnail(props) {
  const { project, onClick, className, style } = props;
  return (
    <Thumbnail
      data={project}
      onClick={onClick}
      renderInfo={() => {
        return <h3>{project.name}</h3>;
      }}
      className={className}
      style={{
        height: "70px",
        padding: "4px",
        ...style
      }}
      colorSpan={5}
    />
  );
}
