const connectionFailedBefore = false;
const socketAuthCompleted = false;
const socketWaitQueue: Array<(sock: typeof Socket | null) => void> = [];

export function clearSocketWaitQueue(sock: typeof Socket | null) {
    if (socketWaitQueue.length > 0) {
        socketWaitQueue.forEach((cb) => {
            cb(sock);
        });
    }
}

export function getC
