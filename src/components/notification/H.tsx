// import styled from "@emotion/styled";
// import { Col, Empty, Row } from "antd";
// import throttle from "lodash/throttle";
// import React from "react";
// import { INotification } from "../../models/notification/notification";
// import { IUser } from "../../models/user/user";
// import { getWindowWidth } from "../../utils/window";
// import StyledCenterContainer from "../styled/CenterContainer";
// import Notification from "./Notification";
// import NotificationList from "./NotificationList";

// export interface INotificationListProps {
//   notifications: INotification[];
//   onClickNotification: (notification: INotification) => void;
//   user: IUser;
//   currentNotificationID?: string;
// }

// interface INotificationListState {
//   renderType: string;
// }

// class Notifications extends React.Component<
//   INotificationListProps,
//   INotificationListState
// > {
//   constructor(props) {
//     super(props);
//     this.state = {
//       renderType: this.getRenderType()
//     };

//     this.setRenderType = throttle(this.setRenderType, 100, { leading: true });
//   }

//   public componentDidMount() {
//     window.addEventListener("resize", this.setRenderType);
//   }

//   public componentWillUnmount() {
//     window.removeEventListener("resize", this.setRenderType);
//   }

//   public render() {
//     const { currentNotificationID, notifications } = this.props;
//     const { renderType } = this.state;

//     if (notifications.length === 0) {
//       return (
//         <StyledCenterContainer>
//           <Empty description="You are all set!" />
//         </StyledCenterContainer>
//       );
//     }

//     if (renderType === "mobile") {
//       if (currentNotificationID) {
//         return this.renderCurrentNotification();
//       }

//       return this.renderNotificationList();
//     }

//     return (
//       <StyledNotificationsDesktop>
//         <StyledNotificationListDesktop span={8}>
//           {this.renderNotificationList()}
//         </StyledNotificationListDesktop>
//         <StyledCurrentNotificationDesktop span={16}>
//           {currentNotificationID ? this.renderCurrentNotification() : null}
//         </StyledCurrentNotificationDesktop>
//       </StyledNotificationsDesktop>
//     );
//   }

//   private findNotification(id: string) {
//     return this.props.notifications.find(
//       nextNotification => nextNotification.customId === id
//     )!;
//   }

//   private setRenderType() {
//     const renderType = this.getRenderType();
//     if (this.state.renderType !== renderType) {
//       this.setState({ renderType });
//     }
//   }

//   private getRenderType() {
//     return getWindowWidth() > 500 ? "desktop" : "mobile";
//   }

//   private renderCurrentNotification() {
//     const { currentNotificationID } = this.props;

//     return <Notification />;
//   }

//   private renderNotificationList() {
//     const {
//       notifications,
//       currentNotificationID,
//       onClickNotification
//     } = this.props;

//     return (
//       <NotificationList
//         notifications={notifications}
//         onClickNotification={onClickNotification}
//         currentNotificationID={currentNotificationID}
//       />
//     );
//   }
// }

// export default Notifications;

// const StyledNotificationsDesktop = styled(Row)({
//   height: "100%",
//   width: "100%"
// });

// const StyledNotificationListDesktop = styled(Col)({
//   height: "100%"
// });

// const StyledCurrentNotificationDesktop = styled(Col)({
//   height: "100%"
// });

export const a = "a";
