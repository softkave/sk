import { SendOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Input } from "antd";
import React from "react";
import { commentConstants } from "../../models/comment/constants";
import StyledContainer from "../styled/Container";

export interface ICommentInputProps {
    onSendComment: (message: string) => void;
}

const CommentInput: React.FC<ICommentInputProps> = (props) => {
    const { onSendComment } = props;

    const [comment, setComment] = React.useState("");
    const sendComment = () => {
        if (comment) {
            onSendComment(comment);
            setComment("");
        }
    };

    return (
        <StyledContainer
            s={{ borderTop: "1px solid #d9d9d9", padding: "8px 5px" }}
        >
            <div
                className={css({
                    display: "flex",
                    flex: 1,
                })}
            >
                <Input.TextArea
                    bordered={false}
                    value={comment}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    maxLength={commentConstants.maxCommentLength}
                    onPressEnter={(evt) => {
                        evt.preventDefault();
                        sendComment();
                    }}
                    style={{ resize: "none" }}
                    placeholder="Enter your comment"
                    onChange={(evt) => {
                        setComment(evt.target.value);
                    }}
                />
            </div>
            <Button
                icon={<SendOutlined />}
                disabled={comment.length === 0}
                onClick={sendComment}
                style={{
                    border: "none",
                    backgroundColor: "inherit",
                    boxShadow: "none",
                    color: comment.length > 0 ? "#1890ff" : undefined,
                }}
            ></Button>
        </StyledContainer>
    );
};

export default CommentInput;
