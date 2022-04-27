import React from "react";

const wrapWithMargin = (
  content: React.ReactNode,
  marginLeft = 12,
  marginRight = 12,
  marginTop = 0,
  marginBottom = 0
) => {
  return (
    <div style={{ marginLeft, marginRight, marginTop, marginBottom }}>
      {content}
    </div>
  );
};

export default wrapWithMargin;
