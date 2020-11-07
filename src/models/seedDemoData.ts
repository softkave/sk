import moment from "moment";
import randomColor from "randomcolor";
import { IOperation, OperationStatus } from "../redux/operations/operation";
import OperationType from "../redux/operations/OperationType";
import { getDateString, getNewId, getNewTempId } from "../utils/utils";
import {
    BlockPriority,
    BlockType,
    IBlock,
    IBlockAssignedLabel,
    IBlockLabel,
    IBlockStatus,
    IBoardTaskResolution,
    ISubTask,
} from "./block/block";
import { getDefaultStatuses } from "./block/utils";
import { IRoom } from "./chat/types";
import {
    CollaborationRequestStatusType,
    INotification,
    NotificationType,
} from "./notification/notification";
import { IUser } from "./user/user";

function seedUser({ name, email }: { name: string; email: string }) {
    const user: IUser = {
        name,
        email,
        rootBlockId: getNewId(),
        customId: getNewId(),
        color: randomColor(),
        createdAt: getDateString(),
        orgs: [],
        notifications: [],
        notificationsLastCheckedAt: getDateString(),
    };

    return user;
}

function updateUserData(
    user: IUser,
    {
        orgs,
        notifications,
    }: {
        orgs: IBlock[];
        notifications: INotification[];
    }
) {
    user.orgs = user.orgs.concat(orgs.map((o) => ({ customId: o.customId })));

    user.notifications = (user.notifications || []).concat(
        notifications.map((notification) => notification.customId)
    );
}

const requestDatesAndStatus = {
    [CollaborationRequestStatusType.Expired]: {
        createdAt: moment().subtract("2", "weeks").toISOString(),
        expires: moment().subtract("1", "week").toISOString(),
        statusHistoryFn: (d) => [
            {
                status: CollaborationRequestStatusType.Pending,
                date: d,
            },
        ],
    },
    [CollaborationRequestStatusType.Declined]: {
        createdAt: moment().subtract("1", "weeks").toISOString(),
        expires: null,
        statusHistoryFn: (d) => [
            {
                status: CollaborationRequestStatusType.Pending,
                date: d,
            },
            {
                status: CollaborationRequestStatusType.Declined,
                date: getDateString(),
            },
        ],
    },
    [CollaborationRequestStatusType.Accepted]: {
        createdAt: moment().subtract("2", "weeks").toISOString(),
        expires: null,
        statusHistoryFn: (d) => [
            {
                status: CollaborationRequestStatusType.Pending,
                date: d,
            },
            {
                status: CollaborationRequestStatusType.Accepted,
                date: moment().subtract("1", "weeks").toISOString(),
            },
        ],
    },
    [CollaborationRequestStatusType.Pending]: {
        createdAt: getDateString(),
        expires: moment().add("1", "week").toISOString(),
        statusHistoryFn: (d = getDateString()) => [
            {
                status: CollaborationRequestStatusType.Pending,
                date: d,
            },
        ],
    },
};

function seedRequest({
    from,
    to,
    fromOrg,
    status,
    message,
}: {
    from: IUser;
    to: IUser;
    fromOrg: IBlock;
    status: CollaborationRequestStatusType;
    message?: string;
}) {
    const r = requestDatesAndStatus[status];

    const request: INotification = {
        body:
            message ||
            "Join us, we have tuna! No we don't, *rolls eyes. But join us?",
        createdAt: r.createdAt,
        customId: getNewId(),
        to: {
            email: to.email,
        },
        type: NotificationType.CollaborationRequest,
        expiresAt: r.expires,
        from: {
            blockId: fromOrg.customId,
            blockName: fromOrg.name!,
            blockType: BlockType.Org,
            name: from.name,
            userId: from.customId,
        },
        statusHistory: r.statusHistoryFn(r.createdAt),
    };

    return request;
}

function seedBlock({
    user,
    name,
    description,
    parent,
    type,
    dueAt,
    priority,
    assignees,
    subTasks,
    resolutions,
    status,
    statusAssignedBy,
    statusAssignedAt,
    taskResolution,
    labels,
    boardStatuses,
    boardLabels,
}: {
    user: IUser;
    type: BlockType;
    name: string;
    description?: string;
    parent?: IBlock;
    dueAt?: string;
    priority?: string;
    assignees?: IUser[];
    subTasks?: ISubTask[];
    resolutions?: IBoardTaskResolution[];
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: string;
    taskResolution?: string | null;
    labels?: IBlockAssignedLabel[];
    boardStatuses?: IBlockStatus[];
    boardLabels?: IBlockLabel[];
}) {
    const seedStatus =
        status ||
        (parent && type === BlockType.Task
            ? parent.boardStatuses![0].customId
            : undefined);

    const org: IBlock = {
        name,
        description,
        type,
        status: status || seedStatus,
        statusAssignedBy:
            statusAssignedBy || (seedStatus ? user.customId : undefined),
        statusAssignedAt:
            statusAssignedAt || (seedStatus ? getDateString() : undefined),
        taskResolution,
        labels,
        priority:
            priority ||
            (type === BlockType.Task ? BlockPriority.NotImportant : undefined),
        subTasks,
        dueAt,
        rootBlockId: parent ? parent.rootBlockId || parent.customId : undefined,
        customId: getNewId(),
        createdAt: getDateString(),
        createdBy: user.customId,
        color: randomColor(),
        boards: [],
        notifications: [],
        collaborators: [],
        boardStatuses:
            boardStatuses ||
            (type !== BlockType.Task ? getDefaultStatuses(user) : undefined),
        boardLabels: boardLabels || (type !== BlockType.Task ? [] : undefined),
        parent: parent ? parent.customId : undefined,
        boardResolutions: resolutions,
        assignees: assignees?.map((a) => ({
            userId: a.customId,
            assignedAt: getDateString(),
            assignedBy: user.customId,
        })),
    };

    return org;
}

function updateBlockData(
    block: IBlock,
    {
        boards,
        notifications,
        collaborators,
    }: {
        boards: IBlock[];
        notifications: INotification[];
        collaborators: IUser[];
    }
) {
    block.boards = (block.boards || []).concat(boards.map((b) => b.customId));

    block.collaborators = (block.collaborators || []).concat(
        collaborators.map((c) => c.customId)
    );

    block.notifications = (block.notifications || []).concat(
        notifications.map((n) => n.customId)
    );
}

function seedRooms({
    org,
    user,
    collaborators,
}: {
    org: IBlock;
    user: IUser;
    collaborators: IUser[];
}): IRoom[] {
    const rooms = collaborators.map((collaborator) => {
        const tempRoomId = getNewTempId(collaborator.customId);
        const tempRoom: IRoom = {
            orgId: org.customId,
            customId: tempRoomId,
            name: "",
            createdAt: "",
            createdBy: "",
            members: [
                { userId: user.customId, readCounter: "" },
                { userId: collaborator.customId, readCounter: "" },
            ],
            recipientId: collaborator.customId,
            unseenChatsStartIndex: null,
            unseenChatsCount: 0,
            chats: [],
        };

        return tempRoom;
    });

    return rooms;
}

function seedUserOps() {
    const loginUserOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoginUser,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    const loadUserRootBlocksOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.LOAD_ROOT_BLOCKS,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    const loadUserNotificationsOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadUserNotifications,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    const loadRoomsAndChatsOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.GetUserRoomsAndChats,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    return [
        loginUserOp,
        loadUserRootBlocksOp,
        loadUserNotificationsOp,
        loadRoomsAndChatsOp,
    ];
}

function seedOrgOps(org: IBlock) {
    const loadOrgUsersAndRequests: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadOrgUsersAndRequests,
        resourceId: org.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    const loadOrgChildren: IOperation = {
        id: getNewId(),
        operationType: OperationType.LOAD_BLOCK_CHILDREN,
        resourceId: org.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
        meta: { typeList: [BlockType.Board] },
    };

    return [loadOrgUsersAndRequests, loadOrgChildren];
}

function seedBoardOps(board: IBlock) {
    const loadBoardChildren: IOperation = {
        id: getNewId(),
        operationType: OperationType.LOAD_BLOCK_CHILDREN,
        resourceId: board.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
        meta: { typeList: [BlockType.Task] },
    };

    const getSprintsOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.GET_SPRINTS,
        resourceId: board.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    return [loadBoardChildren, getSprintsOp];
}

function seedResolutions(
    user: IUser,
    resolutions: Array<{ name: string; description?: string }>
): IBoardTaskResolution[] {
    return resolutions.map((r) => ({
        customId: getNewId(),
        createdAt: getDateString(),
        createdBy: user.customId,
        name: r.name,
        description: r.description,
    }));
}

function seedLabels(
    user: IUser,
    labels: Array<{ name: string; color?: string; description?: string }>
): IBlockLabel[] {
    return labels.map((r) => ({
        customId: getNewId(),
        createdAt: getDateString(),
        createdBy: user.customId,
        name: r.name,
        color: r.color || randomColor(),
        description: r.description,
    }));
}

function seedStatuses(
    user: IUser,
    statuses: Array<{ name: string; color?: string; description?: string }>
): IBlockStatus[] {
    return statuses.map((r) => ({
        customId: getNewId(),
        createdAt: getDateString(),
        createdBy: user.customId,
        name: r.name,
        color: r.color || randomColor(),
        description: r.description,
    }));
}

function seedTaskLabels(
    user: IUser,
    labels: IBlockLabel[]
): IBlockAssignedLabel[] {
    return labels.map((l) => ({
        customId: l.customId,
        assignedBy: user.customId,
        assignedAt: getDateString(),
    }));
}

export default function seedDemoData({ name }: { name?: string } = {}) {
    const user = seedUser({
        name: name || "Abayomi Isaac",
        email: "demo-user-1@softkave.com",
    });

    const demoUser2 = seedUser({
        name: "Solomon Temitope",
        email: "demo-user-2@softkave.com",
    });

    const demoUser3 = seedUser({
        name: "Yomi Isaac",
        email: "demo-user-3@softkave.com",
    });

    const org1 = seedBlock({
        user,
        name: "Softkave",
        type: BlockType.Org,
        description:
            "We make startup productivity tools, from chat, to task management.",
    });

    const org2 = seedBlock({
        user,
        name: "Our Awesome Company",
        type: BlockType.Org,
        description:
            "We are just very awesome individuals that do what we love.",
    });

    const org3 = seedBlock({
        user,
        name: "The Can Factory",
        type: BlockType.Org,
        description:
            "Simple and efficient can factory. We strive to be the best!",
    });

    const org4 = seedBlock({
        user,
        name: "Pot of Beans",
        type: BlockType.Org,
        description: "We make comic books.",
    });

    const org1Rooms = seedRooms({
        user,
        org: org1,
        collaborators: [demoUser2],
    });

    const org4Rooms = seedRooms({
        user,
        org: org4,
        collaborators: [demoUser3],
    });

    const board1 = seedBlock({
        user,
        name: "App Engineering Efforts",
        type: BlockType.Board,
        description: "Our apps engineering efforts",
        parent: org1,
        boardStatuses: seedStatuses(user, [
            {
                name: "Todo",
                description: "Available tasks.",
            },
            {
                name: "In Progress",
                description: "Currently being worked on.",
            },
            {
                name: "Test",
                description: "Work is done, and is in testing.",
            },
            {
                name: "Staging",
                description:
                    "Testing is completed, and is deployed to staging, and pending review.",
            },
            {
                name: "Done",
                description: "Completed, and reviewed.",
            },
        ]),
        boardLabels: seedLabels(user, [
            {
                name: "Frontend",
                description: "Frontend tasks.",
            },
            {
                name: "Backend",
                description: "Server-side tasks.",
            },
            {
                name: "Bug",
                description: "Bugs.",
                color: "rgb(244, 117, 54)",
            },
        ]),
        resolutions: seedResolutions(user, [
            {
                name: "Deployed",
                description: "Deployed to production.",
            },
            {
                name: "Won't Do",
                description: "Task no longer necessary.",
            },
        ]),
    });

    const board2 = seedBlock({
        user,
        name: "Marketing 101",
        type: BlockType.Board,
        parent: org1,
        description: "Just some marketing efforts here and there.",
        boardLabels: seedLabels(user, [
            {
                name: "Organic advertisement",
                description: "For efforts to gain traction organically.",
            },
            {
                name: "Paid advertisement",
                description:
                    "For efforts to gain traction by paid advertisements.",
            },
        ]),
        resolutions: seedResolutions(user, [
            {
                name: "Completed",
                description: "Task is done done!",
            },
            {
                name: "Won't Do",
                description: "Task no longer deemed necessary.",
            },
        ]),
    });

    const task1 = seedBlock({
        user,
        name: "Build Softkave, a super-awesome chat and task management app.",
        type: BlockType.Task,
        description:
            "We are currently light on details, but we'll update the task as we receive more information from the higher up. -- Classic Product Manager tact. LoL.",
        assignees: [user, demoUser2],
        dueAt: moment().add(2, "weeks").toISOString(),
        parent: board1,
        labels: seedTaskLabels(user, [
            board1.boardLabels![0],
            board1.boardLabels![2],
        ]),
        priority: BlockPriority.Important,
        status: board1.boardStatuses![0].customId,
    });

    const task2 = seedBlock({
        user,
        name: "Avengers Assemble!",
        type: BlockType.Task,
        description:
            "Hired skill workers for the task ahead, it's not for the faint of heart.",
        assignees: [user, demoUser2],
        dueAt: moment().add(2, "weeks").toISOString(),
        parent: board1,
        labels: seedTaskLabels(user, [
            board1.boardLabels![1],
            board1.boardLabels![2],
        ]),
        priority: BlockPriority.Important,
        status: board1.boardStatuses![1].customId,
    });

    const task3 = seedBlock({
        user,
        name: "Rule the world, muah ha ha!!",
        type: BlockType.Task,
        description:
            "Just casually displaying Darth Vader traits! Long live the Sith!!",
        assignees: [user, demoUser2],
        dueAt: moment().add(2, "weeks").toISOString(),
        parent: board1,
        labels: seedTaskLabels(user, [board1.boardLabels![2]]),
        priority: BlockPriority.VeryImportant,
        status: board1.boardStatuses![board1.boardStatuses!.length - 1]
            .customId,
        taskResolution: board1.boardResolutions![0].customId,
    });

    const userOrg4PendingRequest = seedRequest({
        from: demoUser3,
        fromOrg: org4,
        to: user,
        status: CollaborationRequestStatusType.Pending,
    });

    const org1AcceptedRequest = seedRequest({
        from: user,
        fromOrg: org1,
        to: demoUser2,
        status: CollaborationRequestStatusType.Accepted,
    });

    const userOps = seedUserOps();
    const org1Ops = seedOrgOps(org1);
    const org4Ops = seedOrgOps(org4);
    const board1Ops = seedBoardOps(board1);
    const board2Ops = seedBoardOps(board2);

    updateUserData(user, {
        notifications: [userOrg4PendingRequest],
        orgs: [org1],
    });

    updateUserData(demoUser2, {
        notifications: [org1AcceptedRequest],
        orgs: [org1],
    });

    updateUserData(demoUser3, {
        notifications: [],
        orgs: [org2, org3, org4],
    });

    updateBlockData(org1, {
        boards: [board1, board2],
        collaborators: [user, demoUser2],
        notifications: [org1AcceptedRequest],
    });

    updateBlockData(org2, {
        boards: [],
        collaborators: [demoUser3],
        notifications: [],
    });

    updateBlockData(org3, {
        boards: [],
        collaborators: [demoUser3],
        notifications: [],
    });

    updateBlockData(org4, {
        boards: [],
        collaborators: [demoUser3, user],
        notifications: [userOrg4PendingRequest],
    });

    return {
        users: [user, demoUser2, demoUser3],
        orgs: [org1, org2, org3, org4],
        boards: [board1, board2],
        tasks: [task1, task2, task3],
        blocks: [org1, org2, org3, org4, board1, board2, task1, task2, task3],
        requests: [userOrg4PendingRequest, org1AcceptedRequest],
        rooms: org1Rooms.concat(org4Rooms),
        ops: userOps.concat(org1Ops, org4Ops, board1Ops, board2Ops),
        web: {
            user,
            org: org1,
            board: board1,
            room: org1Rooms[0],
            recipient: demoUser2,
            request: userOrg4PendingRequest,
            labelList: board1.boardLabels!,
            orgUsers: [user, demoUser2],
            resolutionsList: board1.boardResolutions!,
            statusList: board1.boardStatuses!,
            task: task1,
        },
    };
}
