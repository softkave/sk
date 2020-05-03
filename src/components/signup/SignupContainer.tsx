import React from "react";
import { useDispatch, useStore } from "react-redux";
import { updateBlockOperationID } from "../../redux/operations/operationIDs";
import signupUserOperationFunc from "../../redux/operations/session/sigupUser";
import useOperation from "../hooks/useOperation";
import Signup, { ISignupFormData } from "./Signup";

const scopeID = "SignupContainer";

const SignupContainer: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const operationStatus = useOperation({
    scopeID,
    operationID: updateBlockOperationID,
  });

  const onSubmit = async (user: ISignupFormData) => {
    return signupUserOperationFunc(store.getState(), dispatch, { user });
  };

  console.log({ operationStatus });

  return (
    <Signup
      isSubmitting
      onSubmit={onSubmit}
      // isSubmitting={operationStatus.isLoading}
      errors={operationStatus.error}
    />
  );
};

export default React.memo(SignupContainer);
