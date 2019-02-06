import React from "react";
import Thumbnail from "../thumbnail/Thumbnail.jsx";

export default function CollaboratorThumbnail(props) {
  const { collaborator } = props;

  return (
    <Thumbnail
      data={collaborator}
      renderInfo={() => {
        return <p>{collaborator.name}</p>;
      }}
      style={{
        height: "60px",
        padding: "4px"
      }}
      colorSpan={4}
      hoverable={false}
    />
  );
}
