import * as yup from "yup";
import { endpointYupOptions } from "../../utils";
import { IOutgoingUpdateSocketEntryPacket, OutgoingSocketEvents } from "../outgoingEventTypes";
import SocketAPI from "../socket";

const updateSocketEntryEventYupSchema = yup.object().shape({
  isActive: yup.boolean(),
});

export default async function updateSocketEntryEvent(
  data: Partial<IOutgoingUpdateSocketEntryPacket>
): Promise<void> {
  return SocketAPI.promisifiedEmit(
    OutgoingSocketEvents.UpdateSocketEntry,
    updateSocketEntryEventYupSchema.validateSync(data, endpointYupOptions)
  );
}
