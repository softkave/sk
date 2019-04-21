import React from "react";
import Thumbnail from "../thumbnail/Thumbnail.jsx";
import moment from "moment";

export default class CollaboratorThumbnail extends React.Component {
  getLatestStatus(statusHistory = []) {
    return statusHistory[statusHistory.length - 1];
  }

  render() {
    const { collaborator, style, onClick } = this.props;
    let headerValue = collaborator.name || collaborator.email;
    let latestStatus = this.getLatestStatus(collaborator.statusHistory);

    return (
      <Thumbnail
        data={collaborator}
        onClick={onClick}
        renderInfo={() => {
          return (
            <React.Fragment>
              <h5>{headerValue}</h5>
              {collaborator.name && (
                <span className="sk-gl-thumbnail-text">
                  {collaborator.email}
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
          height: "80px",
          ...style
        }}
        colorSpan={collaborator.color ? 4 : 0}
        hoverable={!!onClick}
      />
    );
  }
}
