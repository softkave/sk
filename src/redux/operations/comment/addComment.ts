import { createAsyncThunk } from "@reduxjs/toolkit";
import { IComment } from "../../../models/comment/types";
import CommentAPI, {
  IAddCommentAPIParameters,
} from "../../../net/comments/comment";
import { getDateString, getNewTempId } from "../../../utils/utils";
import CommentActions from "../../comments/actions";
import SessionSelectors from "../../session/selectors";
import TaskSelectors from "../../tasks/selectors";
import { IAppAsyncThunkConfig } from "../../types";

export const addCommentOpAction = createAsyncThunk<
  void,
  IAddCommentAPIParameters,
  IAppAsyncThunkConfig
>("op/comment/addComment", async (arg, thunkAPI) => {
  const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
  const user = SessionSelectors.assertGetUser(thunkAPI.getState());
  const commentTempId = getNewTempId();
  const task = TaskSelectors.assertGetOne(thunkAPI.getState(), arg.taskId);
  let comment: IComment = {
    // TODO: should we implement like a clientId that doesn't change
    // and we can use it where id is needed in the app, like for react
    // component keys?
    // Same for other resources like it, and it'd be good for offline usage.
    customId: commentTempId,

    orgId: task.rootBlockId!,
    boardId: task.parent!,
    sending: true,
    taskId: arg.taskId,
    comment: arg.comment,
    createdBy: user.customId,
    createdAt: getDateString(),
  };

  try {
    thunkAPI.dispatch(
      CommentActions.add({
        id: comment.customId,
        data: comment,
      })
    );

    if (!isDemoMode) {
      const result = await CommentAPI.addComment({
        taskId: arg.taskId,
        comment: arg.comment,
      });

      if (result && result.errors) {
        throw result.errors;
      }

      comment = result.comment;
      comment.sending = false;
      comment.queued = false;
      thunkAPI.dispatch(
        CommentActions.update({
          id: commentTempId,
          data: comment,
          meta: { arrayUpdateStrategy: "replace" },
        })
      );
    } else {
      thunkAPI.dispatch(
        CommentActions.update({
          id: commentTempId,
          data: { sending: false },
          meta: { arrayUpdateStrategy: "replace" },
        })
      );
    }
  } catch (error) {
    thunkAPI.dispatch(
      CommentActions.update({
        id: commentTempId,
        meta: { arrayUpdateStrategy: "replace" },
        data: { sending: false, errorMessage: "Error sending comment" },
      })
    );
  }
});
