import React from "react";

const LoadingEllipsis: React.FC<{}> = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "32px",
    }}
  >
    ...
  </div>
);

export default LoadingEllipsis;
