import React from "react";
import Thumbnail from "../thumbnail/Thumbnail.jsx";

export default function CollaboratorThumbnail(props) {
  const { collaborator, style, labelPropName } = props;

  return (
    <Thumbnail
      data={collaborator}
      renderInfo={() => {
        return (
          <p style={{ padding: "0 1em" }}>
            {collaborator[labelPropName || "name"]}
          </p>
        );
      }}
      style={{
        height: "60px",
        padding: "4px",
        maxWidth: "300px",
        ...style
      }}
      colorSpan={collaborator.color ? 4 : 0}
      hoverable={false}
    />
  );
}
