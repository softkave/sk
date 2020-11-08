import withDrawer, { WithDrawerType } from "../withDrawer";
import FeedbackForm from "./FeedbackForm";

export default withDrawer(FeedbackForm, {
    type: WithDrawerType.Modal,
});
