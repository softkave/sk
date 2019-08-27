import { connect } from "react-redux";
import netInterface from "../../../net";
import { getReduxConnectors } from "../../../utils/redux";
import { IPipeline, makePipeline } from "../../FormPipeline";
import ForgotPassword from "./ForgotPassword";

interface IForgotPasswordParams {
  email: string;
}

const methods: IPipeline<
  IForgotPasswordParams,
  IForgotPasswordParams,
  undefined,
  null
> = {
  async net({ params }) {
    return await netInterface("user.forgotPassword", { email: params.email });
  }
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state, { dispatch }) {
  return {
    onSubmit: makePipeline(methods, { state, dispatch })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ForgotPassword);
