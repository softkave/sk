import React from "react";
import Thumbnail from "../../thumbnail/Thumbnail";

export default function OrgThumbnail(props) {
  const { org, className, style, onClick } = props;
  return (
    <Thumbnail
      className={className}
      data={org}
      onClick={onClick}
      renderInfo={() => {
        return <h3>{org.name}</h3>;
      }}
      style={{
        cursor: "pointer",
        ...style
      }}
      colorSpan={5}
    />
  );
}
