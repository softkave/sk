import withDrawer, { WithDrawerType } from "../withDrawer";
import FeedbackFormContainer from "./FeedbackFormContainer";

export default withDrawer(FeedbackFormContainer, {
    type: WithDrawerType.Modal,
    footer: null,
});
