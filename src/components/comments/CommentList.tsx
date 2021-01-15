import { css } from "@emotion/css";
import React from "react";
import { IComment } from "../../models/comment/types";
import { IUser } from "../../models/user/user";
import Message from "../Message";
import Scrollbar from "../utilities/Scrollbar";
import Comment from "./Comment";

export interface ICommentListProps {
    comments: IComment[];
    usersMap: { [key: string]: IUser };
}

const CommentList: React.FC<ICommentListProps> = (props) => {
    const { comments, usersMap } = props;

    if (comments.length === 0) {
        return <Message message="No comments!" />;
    }

    let hideAvatarCheck: { [key: string]: boolean } = {};

    return (
        <Scrollbar>
            {comments.map((comment, i) => {
                const sender = usersMap[comment.createdBy];
                const commentNode = (
                    <Comment
                        key={i}
                        comment={comment}
                        sender={sender}
                        hideAvatar={hideAvatarCheck[comment.createdBy]}
                        className={css({
                            margin: "16px",
                            marginTop: i === 0 ? "16px" : 0,
                        })}
                    />
                );

                hideAvatarCheck = { [comment.createdBy]: true };
                return commentNode;
            })}
        </Scrollbar>
    );
};

export default CommentList;
