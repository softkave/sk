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
            s={{
                // borderTop: "1px solid #f0f0f0",
                borderBottom: "1px solid #f0f0f0",
                padding: "8px 0px",
            }}
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
                    style={{ resize: "none", paddingLeft: 0, paddingRight: 0 }}
                    placeholder="Add comment"
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
