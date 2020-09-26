import moment from "moment";
import randomColor from "randomcolor";
import { IOperation, OperationStatus } from "../redux/operations/operation";
import OperationType from "../redux/operations/OperationType";
import { getDateString, getNewId } from "../utils/utils";
import { BlockType, IBlock } from "./block/block";
import { getDefaultStatuses } from "./block/utils";
import {
    CollaborationRequestStatusType,
    INotification,
    NotificationType,
} from "./notification/notification";
import { IUser } from "./user/user";

export default function seedDemoData() {
    const user: IUser = {
        rootBlockId: getNewId(),
        customId: getNewId(),
        color: randomColor(),
        createdAt: getDateString(),
        email: `demo-user-0@softkave.com`,
        name: `Demo User Zero`,
        orgs: [],
        notifications: [],
        notificationsLastCheckedAt: getDateString(),
    };

    const expiredRequestSendDate = moment()
        .subtract("2", "weeks")
        .toISOString();
    const expiredRequest: INotification = {
        body: `This is an example of an expired collaboration request.`,
        createdAt: expiredRequestSendDate,
        customId: getNewId(),
        to: {
            email: user.email,
        },
        type: NotificationType.CollaborationRequest,
        expiresAt: moment().subtract("1", "week").toISOString(),
        from: {
            blockId: getNewId(),
            blockName: "Demo Org 123",
            blockType: BlockType.Org,
            name: "Demo User 123",
            userId: getNewId(),
        },
        statusHistory: [
            {
                status: CollaborationRequestStatusType.Pending,
                date: expiredRequestSendDate,
            },
        ],
    };

    const declinedRequestSendDate = moment()
        .subtract("1", "weeks")
        .toISOString();
    const declinedRequest: INotification = {
        body: `This is an example of a declined collaboration request.`,
        createdAt: declinedRequestSendDate,
        customId: getNewId(),
        to: {
            email: user.email,
        },
        type: NotificationType.CollaborationRequest,
        from: {
            blockId: getNewId(),
            blockName: "Demo Org 098",
            blockType: BlockType.Org,
            name: "Demo User 098",
            userId: getNewId(),
        },
        statusHistory: [
            {
                status: CollaborationRequestStatusType.Pending,
                date: declinedRequestSendDate,
            },
            {
                status: CollaborationRequestStatusType.Declined,
                date: getDateString(),
            },
        ],
    };

    user.notifications = (user.notifications || []).concat([
        expiredRequest.customId,
        declinedRequest.customId,
    ]);

    const org: IBlock = {
        type: BlockType.Org,
        customId: getNewId(),
        createdAt: getDateString(),
        createdBy: user.customId,
        color: randomColor(),
        boards: [],
        name: "Softkave",
        description:
            "Softkave is a project/task management app, with chat systems ( coming soon! ).",
        notifications: [],
        collaborators: [],
        boardStatuses: getDefaultStatuses(user),
    };

    const softkaveAppBoard: IBlock = {
        type: BlockType.Board,
        customId: getNewId(),
        createdAt: getDateString(),
        createdBy: org.createdBy,
        color: randomColor(),
        parent: org.customId,
        rootBlockId: org.customId,
        name: `Product Plan`,
        description:
            "To track and manage the development progress of the our product.",
        boardLabels: [
            {
                color: randomColor(),
                createdAt: getDateString(),
                createdBy: org.createdBy,
                customId: getNewId(),
                name: "frontend",
                description: "To signify frontend tasks",
            },
            {
                color: randomColor(),
                createdAt: getDateString(),
                createdBy: org.createdBy,
                customId: getNewId(),
                name: "backend",
                description: "To signify backend tasks",
            },
        ],
        boardStatuses: getDefaultStatuses(user),
    };

    const marketingPlansBoard: IBlock = {
        type: BlockType.Board,
        customId: getNewId(),
        createdAt: getDateString(),
        createdBy: org.createdBy,
        color: randomColor(),
        parent: org.customId,
        rootBlockId: org.customId,
        name: `Marketing Plans`,
        description:
            "For housing our marketing, brand, and user acquisition efforts.",
        boardLabels: [
            {
                color: randomColor(),
                createdAt: getDateString(),
                createdBy: org.createdBy,
                customId: getNewId(),
                name: "Organic advertisement",
                description: "For efforts to gain users organically.",
            },
            {
                color: randomColor(),
                createdAt: getDateString(),
                createdBy: org.createdBy,
                customId: getNewId(),
                name: "Paid advertisement",
                description:
                    "For efforts to gain users by paid advertisements.",
            },
        ],
        boardStatuses: getDefaultStatuses(user),
    };

    const demoUser1: IUser = {
        rootBlockId: "",
        customId: getNewId(),
        color: randomColor(),
        createdAt: getDateString(),
        email: `demo-user-1@softkave.com`,
        name: `Demo User One`,
        orgs: [],
        notifications: [],
        notificationsLastCheckedAt: getDateString(),
    };

    const demoUser1RequestSendDate = moment()
        .subtract("2", "weeks")
        .toISOString();

    const demoUser1OrgRequest: INotification = {
        body: `Sample collaboration request.`,
        createdAt: demoUser1RequestSendDate,
        customId: getNewId(),
        to: {
            email: demoUser1.email,
        },
        type: NotificationType.CollaborationRequest,
        from: {
            blockId: org.customId,
            blockName: org.name!,
            blockType: BlockType.Org,
            name: user.name,
            userId: user.customId,
        },
        statusHistory: [
            {
                status: CollaborationRequestStatusType.Pending,
                date: demoUser1RequestSendDate,
            },
            {
                status: CollaborationRequestStatusType.Accepted,
                date: moment().subtract("1", "weeks").toISOString(),
            },
        ],
    };

    user.orgs = user.orgs.concat([{ customId: org.customId }]);
    org.boards = (org.boards || []).concat([
        softkaveAppBoard.customId,
        marketingPlansBoard.customId,
    ]);
    org.collaborators = (org.collaborators || []).concat(
        user.customId,
        demoUser1.customId
    );
    org.notifications = (org.notifications || []).concat(
        demoUser1OrgRequest.customId
    );

    const pendingRequestOrg: IBlock = {
        type: BlockType.Org,
        customId: getNewId(),
        createdAt: getDateString(),
        createdBy: demoUser1.customId,
        color: randomColor(),
        boards: [],
        name: "Demo Org One",
        description: "",
        notifications: [],
        collaborators: [demoUser1.customId, user.customId],
    };

    demoUser1.orgs = demoUser1.orgs.concat([
        { customId: pendingRequestOrg.customId },
        { customId: org.customId },
    ]);
    demoUser1.notifications = (demoUser1.notifications || []).concat(
        demoUser1OrgRequest.customId
    );

    const pendingRequest: INotification = {
        body: `Hi Demo User Zero, this is One from ${
            pendingRequestOrg.name
        }.${" "}
            Please accpet the collaboration request to access our task management system,${" "}
            And we are delighted to have on board.`,
        createdAt: getDateString(),
        customId: getNewId(),
        to: {
            email: user.email,
        },
        type: NotificationType.CollaborationRequest,
        expiresAt: moment().add("1", "week").toISOString(),
        from: {
            blockId: pendingRequestOrg.customId,
            blockName: pendingRequestOrg.name!,
            blockType: BlockType.Org,
            name: demoUser1.name,
            userId: demoUser1.customId,
        },
        statusHistory: [
            {
                status: CollaborationRequestStatusType.Pending,
                date: getDateString(),
            },
        ],
    };

    pendingRequestOrg.notifications = (
        pendingRequestOrg.notifications || []
    ).concat([pendingRequest.customId]);
    user.notifications.push(pendingRequest.customId);

    const loginUserOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoginUser,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    const loadUserRootBlocksOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadRootBlocks,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    const loadBoardDataOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadBoardData,
        resourceId: org.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    const loadOrgChildren: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadBlockChildren,
        resourceId: org.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
        meta: { typeList: [BlockType.Board] },
    };

    const loadPendingReqOrgBoardDataOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadBoardData,
        resourceId: pendingRequestOrg.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    const loadPendingReqOrgBlockChildren: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadBlockChildren,
        resourceId: pendingRequestOrg.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
        meta: { typeList: [BlockType.Board] },
    };

    const loadSoftkaveAppBoardChildren: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadBlockChildren,
        resourceId: softkaveAppBoard.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
        meta: { typeList: [BlockType.Task] },
    };

    const loadMarketingPlansBoardOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadBlockChildren,
        resourceId: marketingPlansBoard.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
        meta: { typeList: [BlockType.Task] },
    };

    const loadUserNotificationsOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadUserNotifications,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    return {
        user,
        notifications: [
            pendingRequest,
            declinedRequest,
            expiredRequest,
            demoUser1OrgRequest,
        ],
        users: [user, demoUser1],
        blocks: [org, pendingRequestOrg, softkaveAppBoard, marketingPlansBoard],
        operations: [
            loginUserOp,
            loadUserRootBlocksOp,
            loadUserNotificationsOp,
            loadBoardDataOp,
            loadOrgChildren,
            loadSoftkaveAppBoardChildren,
            loadMarketingPlansBoardOp,
            loadPendingReqOrgBoardDataOp,
            loadPendingReqOrgBlockChildren,
        ],
    };
}
