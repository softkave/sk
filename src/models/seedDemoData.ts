import moment from "moment";
import randomColor from "randomcolor";
import { IOperation, OperationStatus } from "../redux/operations/operation";
import OperationType from "../redux/operations/OperationType";
import { getDateString, getNewId } from "../utils/utils";
import {
    BlockPriority,
    BlockType,
    IAssigneeInput,
    IBlock,
    IBlockAssignedLabel,
    IBlockAssignedLabelInput,
    IBlockLabel,
    IBlockLabelInput,
    IBlockStatus,
    IBlockStatusInput,
    IBoardStatusResolutionInput,
    IBoardTaskResolution,
    ISubTask,
    ISubTaskInput,
    ITaskAssignee,
    ITaskSprint,
    ITaskSprintInput,
} from "./block/block";
import { getDefaultStatuses } from "./block/utils";
import { IRoom } from "./chat/types";
import { getTempRoomId } from "./chat/utils";
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

const seedRequestDatesAndStatus = {
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

export function seedRequest({
    from,
    toEmail,
    fromOrg,
    status,
}: {
    from: IUser;
    toEmail: string;
    fromOrg: IBlock;
    status: CollaborationRequestStatusType;
    message?: string;
}) {
    const d = seedRequestDatesAndStatus[status];

    const request: INotification = {
        createdAt: d.createdAt,
        customId: getNewId(),
        to: {
            email: toEmail,
        },
        type: NotificationType.CollaborationRequest,
        from: {
            blockId: fromOrg.customId,
            blockName: fromOrg.name!,
            blockType: BlockType.Org,
            name: from.name,
            userId: from.customId,
        },
        statusHistory: d.statusHistoryFn(d.createdAt),
    };

    return request;
}

export function seedBlock(
    user: IUser,
    p: {
        type: BlockType;
        name: string;
        description?: string;
        parent?: string;
        dueAt?: string;
        priority?: BlockPriority;
        assignees?: IAssigneeInput[];
        subTasks?: ISubTaskInput[];
        boardResolutions?: IBoardStatusResolutionInput[];
        status?: string | null;
        statusAssignedBy?: string;
        statusAssignedAt?: string;
        taskResolution?: string | null;
        labels?: IBlockAssignedLabelInput[];
        boardStatuses?: IBlockStatusInput[];
        boardLabels?: IBlockLabelInput[];
        rootBlockId?: string;
        taskSprint?: ITaskSprintInput | null;
        customId?: string;
        createdAt?: string;
        createdBy?: string;
        color?: string;
        boards?: string[];
        notifications?: string[];
        collaborators?: string[];
    }
) {
    const isTask = p.type === BlockType.Task;
    const block: IBlock = {
        name: p.name,
        description: p.description,
        type: p.type,
        status: p.status,
        statusAssignedBy:
            p.statusAssignedBy || (p.status ? user.customId : undefined),
        statusAssignedAt:
            p.statusAssignedAt || (p.status ? getDateString() : undefined),
        taskResolution: p.taskResolution,
        labels: p.labels && seedTaskLabels(user, p.labels),
        priority:
            p.priority || (isTask ? BlockPriority.NotImportant : undefined),
        subTasks: p.subTasks && seedSubTasks(user, p.subTasks),
        dueAt: p.dueAt,
        rootBlockId: p.rootBlockId,
        customId: p.customId || getNewId(),
        createdAt: p.createdAt || getDateString(),
        createdBy: p.createdBy || user.customId,
        color: p.color || !isTask ? randomColor() : undefined,
        boards: p.boards || [],
        notifications: p.notifications || [],
        collaborators: p.collaborators || [],
        boardStatuses:
            (p.boardStatuses && seedStatuses(user, p.boardStatuses)) ||
            (!isTask ? getDefaultStatuses(user) : undefined),
        boardLabels:
            (p.boardLabels && seedLabels(user, p.boardLabels)) ||
            (!isTask ? [] : undefined),
        parent: p.parent,
        boardResolutions:
            p.boardResolutions && seedResolutions(user, p.boardResolutions),
        assignees: p.assignees && seedTaskAssignees(user, p.assignees),
        taskSprint: p.taskSprint && seedTaskSprint(user, p.taskSprint),
    };

    return block;
}

export function seedUpdateBlock(
    user: IUser,
    p: {
        type: BlockType;
        assignees?: IAssigneeInput[];
        subTasks?: ISubTaskInput[];
        boardResolutions?: IBoardStatusResolutionInput[];
        status?: string | null;
        statusAssignedBy?: string;
        statusAssignedAt?: string;
        taskResolution?: string | null;
        labels?: IBlockAssignedLabelInput[];
        boardStatuses?: IBlockStatusInput[];
        boardLabels?: IBlockLabelInput[];
        taskSprint?: ITaskSprintInput | null;
    }
) {
    const isTask = p.type === BlockType.Task;
    const block: Partial<IBlock> = {
        status: p.status,
        statusAssignedBy:
            p.statusAssignedBy || (p.status ? user.customId : undefined),
        statusAssignedAt:
            p.statusAssignedAt || (p.status ? getDateString() : undefined),
        labels: p.labels && seedTaskLabels(user, p.labels),
        subTasks: p.subTasks && seedSubTasks(user, p.subTasks),
        boardStatuses:
            (p.boardStatuses && seedStatuses(user, p.boardStatuses)) ||
            (!isTask ? getDefaultStatuses(user) : undefined),
        boardLabels:
            (p.boardLabels && seedLabels(user, p.boardLabels)) ||
            (!isTask ? [] : undefined),
        boardResolutions:
            p.boardResolutions && seedResolutions(user, p.boardResolutions),
        assignees: p.assignees && seedTaskAssignees(user, p.assignees),
        taskSprint: p.taskSprint && seedTaskSprint(user, p.taskSprint),
    };

    return block;
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
        const tempRoomId = getTempRoomId(org.customId, collaborator.customId);
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
        operationType: OperationType.LoadRootBlocks,
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
        operationType: OperationType.LoadBlockChildren,
        resourceId: org.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
        meta: { typeList: [BlockType.Board] },
    };

    return [loadOrgUsersAndRequests, loadOrgChildren];
}

function seedBoardOps(board: IBlock) {
    const loadBoardChildren: IOperation = {
        id: getNewId(),
        operationType: OperationType.LoadBlockChildren,
        resourceId: board.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
        meta: { typeList: [BlockType.Task] },
    };

    const getSprintsOp: IOperation = {
        id: getNewId(),
        operationType: OperationType.GetSprints,
        resourceId: board.customId,
        status: { status: OperationStatus.Completed, timestamp: Date.now() },
    };

    return [loadBoardChildren, getSprintsOp];
}

function seedResolutions(
    user: IUser,
    resolutions: (Partial<IBoardTaskResolution> & IBoardStatusResolutionInput)[]
): IBoardTaskResolution[] {
    return resolutions.map((resolution) => ({
        customId: resolution.customId || getNewId(),
        createdAt: resolution.createdAt || getDateString(),
        createdBy: resolution.createdBy || user.customId,
        name: resolution.name,
        description: resolution.description,
    }));
}

function seedLabels(
    user: IUser,
    labels: (Partial<IBlockLabel> & IBlockLabelInput)[]
): IBlockLabel[] {
    return labels.map((label) => ({
        customId: label.customId || getNewId(),
        createdAt: label.createdAt || getDateString(),
        createdBy: label.createdBy || user.customId,
        name: label.name,
        color: label.color || randomColor(),
        description: label.description,
    }));
}

function seedStatuses(
    user: IUser,
    statuses: (Partial<IBlockStatus> & IBlockStatusInput)[]
): IBlockStatus[] {
    return statuses.map((status) => ({
        customId: status.customId || getNewId(),
        createdAt: status.createdAt || getDateString(),
        createdBy: status.createdBy || user.customId,
        name: status.name,
        color: status.color || randomColor(),
        description: status.description,
        position: status.position,
    }));
}

export function seedTaskLabels(
    user: IUser,
    labels: (IBlockAssignedLabelInput & Partial<IBlockAssignedLabel>)[]
): IBlockAssignedLabel[] {
    return labels.map((label) => ({
        customId: label.customId,
        assignedBy: user.customId,
        assignedAt: label.assignedAt || getDateString(),
    }));
}

export function seedTaskAssignees(
    user: IUser,
    assignees: (Partial<ITaskAssignee> & IAssigneeInput)[]
): ITaskAssignee[] {
    return assignees.map((assignee) => ({
        userId: assignee.userId,
        assignedBy: assignee.assignedBy || user.customId,
        assignedAt: assignee.assignedAt || getDateString(),
    }));
}

export function seedSubTasks(
    user: IUser,
    subTasks: (Partial<ISubTask> & ISubTaskInput)[]
): ISubTask[] {
    return subTasks.map((subTask) => ({
        customId: subTask.customId || getNewId(),
        description: subTask.description,
        createdAt: subTask.createdAt || getDateString(),
        createdBy: subTask.createdBy || user.customId,
    }));
}

export function seedTaskSprint(
    user: IUser,
    taskSprint: Partial<ITaskSprint> & ITaskSprintInput
): ITaskSprint {
    return {
        sprintId: taskSprint.sprintId,
        assignedAt: taskSprint.assignedAt || getDateString(),
        assignedBy: taskSprint.assignedBy || user.customId,
    };
}

export default function seedDemoData({ name }: { name?: string } = {}) {
    const user = seedUser({
        name: name || "Abayomi Isaac",
        email: "demo-user-1@softkave.com",
    });

    const user_Solomon = seedUser({
        name: "Solomon Temitope",
        email: "demo-user-2@softkave.com",
    });

    const user_YomiIsaac = seedUser({
        name: "Yomi Isaac",
        email: "demo-user-3@softkave.com",
    });

    const org_Softkave = seedBlock(user, {
        name: "Softkave",
        type: BlockType.Org,
        description:
            "We make startup productivity tools, from chat, to task management.",
    });

    const org_AwesomeCollections = seedBlock(user, {
        name: "Awesome Collections",
        type: BlockType.Org,
        description: "Just some awesome collections.",
    });

    const org_CanFactory = seedBlock(user, {
        name: "The Can Factory",
        type: BlockType.Org,
        description:
            "Simple and efficient can factory. We strive to be the best!",
    });

    const org_PotOfBeans = seedBlock(user, {
        name: "Pot of Beans",
        type: BlockType.Org,
        description: "We make comic books.",
    });

    const room_Softkave_withSolomon = seedRooms({
        user,
        org: org_Softkave,
        collaborators: [user_Solomon],
    });

    const room_Beans_withYomiIsaac = seedRooms({
        user,
        org: org_PotOfBeans,
        collaborators: [user_YomiIsaac],
    });

    const room_Can_withYomiIsaac = seedRooms({
        user,
        org: org_CanFactory,
        collaborators: [user_YomiIsaac],
    });

    const room_Awesome_withYomiIsaac = seedRooms({
        user,
        org: org_AwesomeCollections,
        collaborators: [user_YomiIsaac],
    });

    const board_Softkave_Engineering = seedBlock(user, {
        name: "App Engineering Efforts",
        type: BlockType.Board,
        description: "Our apps engineering efforts",
        parent: org_Softkave.customId,
        rootBlockId: org_Softkave.customId,
        boardStatuses: [
            {
                customId: getNewId(),
                name: "Todo",
                description: "Available tasks.",
                color: randomColor(),
                position: 0,
            },
            {
                customId: getNewId(),
                name: "In Progress",
                description: "Currently being worked on.",
                color: randomColor(),
                position: 1,
            },
            {
                customId: getNewId(),
                name: "Test",
                description: "Work is done, and is in testing.",
                color: randomColor(),
                position: 2,
            },
            {
                customId: getNewId(),
                name: "Staging",
                description:
                    "Testing is completed, and is deployed to staging, and pending review.",
                color: randomColor(),
                position: 3,
            },
            {
                customId: getNewId(),
                name: "Done",
                description: "Completed, and reviewed.",
                color: randomColor(),
                position: 4,
            },
        ],
        boardLabels: [
            {
                customId: getNewId(),
                name: "Frontend",
                description: "Frontend tasks.",
                color: randomColor(),
            },
            {
                customId: getNewId(),
                name: "Backend",
                description: "Server-side tasks.",
                color: randomColor(),
            },
            {
                customId: getNewId(),
                name: "Bug",
                description: "Bugs.",
                color: "rgb(244, 117, 54)",
            },
        ],
        boardResolutions: [
            {
                customId: getNewId(),
                name: "Deployed",
                description: "Deployed to production.",
            },
            {
                customId: getNewId(),
                name: "Won't Do",
                description: "Task no longer necessary.",
            },
        ],
    });

    const board_Softkave_Marketing = seedBlock(user, {
        name: "Marketing 101",
        type: BlockType.Board,
        parent: org_Softkave.customId,
        rootBlockId: org_Softkave.customId,
        description: "Just some marketing efforts here and there.",
        boardLabels: [
            {
                customId: getNewId(),
                name: "Organic advertisement",
                description: "For efforts to gain traction organically.",
                color: randomColor(),
            },
            {
                customId: getNewId(),
                name: "Paid advertisement",
                description:
                    "For efforts to gain traction by paid advertisements.",
                color: randomColor(),
            },
        ],
        boardResolutions: [
            {
                customId: getNewId(),
                name: "Completed",
                description: "Task is done done!",
            },
            {
                customId: getNewId(),
                name: "Won't Do",
                description: "Task no longer deemed necessary.",
            },
        ],
    });

    const task_Softkave_Engineering_1 = seedBlock(user, {
        name: "Build Softkave, a super-awesome chat and task management app.",
        type: BlockType.Task,
        description:
            "We are currently light on details, but we'll update the task as we receive more information from the higher up. -- Classic Product Manager tact. LoL.",
        assignees: [user, user_Solomon].map((data) => ({
            userId: data.customId,
        })),
        dueAt: moment().add(2, "weeks").toISOString(),
        parent: board_Softkave_Engineering.customId,
        rootBlockId: board_Softkave_Engineering.rootBlockId,
        labels: [
            board_Softkave_Engineering.boardLabels![0],
            board_Softkave_Engineering.boardLabels![2],
        ],
        priority: BlockPriority.Important,
        status: board_Softkave_Engineering.boardStatuses![0].customId,
    });

    const task_Softkave_Engineering_2 = seedBlock(user, {
        name: "Avengers Assemble!",
        type: BlockType.Task,
        description:
            "Hired skill workers for the task ahead, it's not for the faint of heart.",
        assignees: [user, user_Solomon].map((data) => ({
            userId: data.customId,
        })),
        dueAt: moment().add(2, "weeks").toISOString(),
        parent: board_Softkave_Engineering.customId,
        rootBlockId: board_Softkave_Engineering.rootBlockId,
        labels: [
            board_Softkave_Engineering.boardLabels![1],
            board_Softkave_Engineering.boardLabels![2],
        ],
        priority: BlockPriority.Important,
        status: board_Softkave_Engineering.boardStatuses![1].customId,
    });

    const task_Softkave_Engineering_3 = seedBlock(user, {
        name: "Rule the world, muah ha ha!!",
        type: BlockType.Task,
        description:
            "Just casually displaying Darth Vader traits! Long live the Sith!!",
        assignees: [user, user_Solomon].map((data) => ({
            userId: data.customId,
        })),
        dueAt: moment().add(2, "weeks").toISOString(),
        parent: board_Softkave_Engineering.customId,
        rootBlockId: board_Softkave_Engineering.rootBlockId,
        labels: seedTaskLabels(user, [
            board_Softkave_Engineering.boardLabels![2],
        ]),
        priority: BlockPriority.VeryImportant,
        status: board_Softkave_Engineering.boardStatuses![
            board_Softkave_Engineering.boardStatuses!.length - 1
        ].customId,
        taskResolution: board_Softkave_Engineering.boardResolutions![0]
            .customId,
    });

    const request_fromBeans_toUser = seedRequest({
        from: user_YomiIsaac,
        fromOrg: org_PotOfBeans,
        toEmail: user.email,
        status: CollaborationRequestStatusType.Pending,
    });

    const userOps = seedUserOps();
    const softkaveOps = seedOrgOps(org_Softkave);
    const awesomeOps = seedOrgOps(org_AwesomeCollections);
    const beansOps = seedOrgOps(org_PotOfBeans);
    const canOps = seedOrgOps(org_CanFactory);
    const softkave_EngineeringOps = seedBoardOps(board_Softkave_Engineering);
    const softkave_MarketingOps = seedBoardOps(board_Softkave_Marketing);

    updateUserData(user, {
        notifications: [request_fromBeans_toUser],
        orgs: [org_Softkave, org_AwesomeCollections, org_CanFactory],
    });

    updateUserData(user_Solomon, {
        notifications: [],
        orgs: [org_Softkave],
    });

    updateUserData(user_YomiIsaac, {
        notifications: [],
        orgs: [org_AwesomeCollections, org_CanFactory, org_PotOfBeans],
    });

    updateBlockData(org_Softkave, {
        boards: [board_Softkave_Engineering, board_Softkave_Marketing],
        collaborators: [user, user_Solomon],
        notifications: [],
    });

    updateBlockData(org_AwesomeCollections, {
        boards: [],
        collaborators: [user_YomiIsaac, user],
        notifications: [],
    });

    updateBlockData(org_CanFactory, {
        boards: [],
        collaborators: [user_YomiIsaac, user],
        notifications: [],
    });

    updateBlockData(org_PotOfBeans, {
        boards: [],
        collaborators: [user_YomiIsaac, user],
        notifications: [request_fromBeans_toUser],
    });

    return {
        users: [user, user_Solomon, user_YomiIsaac],
        orgs: [
            org_Softkave,
            org_AwesomeCollections,
            org_CanFactory,
            org_PotOfBeans,
        ],
        boards: [board_Softkave_Engineering, board_Softkave_Marketing],
        tasks: [
            task_Softkave_Engineering_1,
            task_Softkave_Engineering_2,
            task_Softkave_Engineering_3,
        ],
        blocks: [
            org_Softkave,
            org_AwesomeCollections,
            org_CanFactory,
            org_PotOfBeans,
            board_Softkave_Engineering,
            board_Softkave_Marketing,
            task_Softkave_Engineering_1,
            task_Softkave_Engineering_2,
            task_Softkave_Engineering_3,
        ],
        requests: [request_fromBeans_toUser],
        rooms: room_Softkave_withSolomon.concat(
            room_Beans_withYomiIsaac,
            room_Awesome_withYomiIsaac,
            room_Can_withYomiIsaac
        ),
        ops: userOps.concat(
            softkaveOps,
            awesomeOps,
            beansOps,
            canOps,
            softkave_EngineeringOps,
            softkave_MarketingOps
        ),
        web: {
            user,
            org: org_Softkave,
            board: board_Softkave_Engineering,
            room: room_Softkave_withSolomon[0],
            recipient: user_Solomon,
            request: request_fromBeans_toUser,
            labelList: board_Softkave_Engineering.boardLabels!,
            orgUsers: [user, user_Solomon],
            resolutionsList: board_Softkave_Engineering.boardResolutions!,
            statusList: board_Softkave_Engineering.boardStatuses!,
            task: task_Softkave_Engineering_1,
        },
    };
}
