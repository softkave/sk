import React from "react";
import { IComment } from "../../models/comment/types";
import { IUser } from "../../models/user/user";
import Message from "../Message";
import StyledContainer from "../styled/Container";
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
                    <StyledContainer
                        key={i}
                        s={{
                            margin: "16px",
                            marginTop: i === 0 ? "16px" : 0,
                        }}
                    >
                        <Comment
                            comment={comment}
                            sender={sender}
                            hideAvatar={hideAvatarCheck[comment.createdBy]}
                        />
                    </StyledContainer>
                );

                hideAvatarCheck = { [comment.createdBy]: true };
                return commentNode;
            })}
        </Scrollbar>
    );
};

export default CommentList;
