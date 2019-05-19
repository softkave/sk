import React from "react";
import Thumbnail from "../thumbnail/Thumbnail.jsx";
import moment from "moment";

export default class CollaboratorThumbnail extends React.Component {
  getLatestStatus(statusHistory = []) {
    return statusHistory[statusHistory.length - 1];
  }

  render() {
    const { collaborator, style, onClick } = this.props;
    let headerValue = collaborator.name;
    let latestStatus = this.getLatestStatus(collaborator.statusHistory);
    const collaboratorEmail =
      collaborator.email || (collaborator.to ? collaborator.to.email : null);

    return (
      <Thumbnail
        data={collaborator}
        onClick={onClick}
        colorSpan={6}
        renderInfo={() => {
          return (
            <React.Fragment>
              {headerValue && (
                <h4 style={{ marginBottom: "0px" }}>{headerValue}</h4>
              )}
              {collaboratorEmail && (
                <span className="sk-gl-thumbnail-text">
                  {collaboratorEmail}
                </span>
              )}
              {collaborator.expiresAt && (
                <span className="sk-gl-thumbnail-text">
                  expires {moment(collaborator.expiresAt).fromNow()}
                </span>
              )}
              {latestStatus && (
                <span className="sk-gl-thumbnail-text">
                  {latestStatus.status}
                </span>
              )}
            </React.Fragment>
          );
        }}
        style={{
          padding: "4px",
          maxWidth: "300px",
          ...style
        }}
        hoverable={!!onClick}
      />
    );
  }
}
