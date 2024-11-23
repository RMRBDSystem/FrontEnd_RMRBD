
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAccountById } from "../services/AccountService"
import "../../assets/styles/Components/commentstyle.css"
import CommentForm from "./CommentForm"

const Comment = ({
    comment,
    replies = [],
    setActiveComment,
    activeComment,
    updateComment,
    deleteComment,
    addComment,
    rootCommentId = null,
    currentUserId,
}) => {
    const fiveMinutes = 300000;
    const timePassed = new Date() - new Date(comment.date) < fiveMinutes;
    const canReply = Boolean(currentUserId);
    const canEdit = currentUserId === comment.customerId && timePassed;
    const canDelete = currentUserId === comment.customerId && timePassed;
    const commentedAt = new Date(comment.date).toLocaleDateString();
    const isReplying =
        activeComment &&
        activeComment.type === 'replying' &&
        activeComment.id === comment.commentId;

    const isEditing =
        activeComment &&
        activeComment.type === 'editing' &&
        activeComment.id === comment.commentId;
    const replyId = rootCommentId ? rootCommentId : comment.commentId;
    const [accountName, setAccountName] = useState("")

    useEffect(() => {
        const fetcAccountData = async () => {
            try {
                const createbyName = await getAccountById(comment.customerId);
                setAccountName(createbyName.userName);
            } catch (err) {
                console.error(err);
            }
        };
        fetcAccountData();
    }, [comment.customerId]);
    return (
        <div className="comment text-white" style={{ display: 'flex' }}>
            <div className="comment-image-container">
                <img src='/images/avatar.png' />
            </div>
            <div className="comment-right-part" >
                <div className="comment-content" style={{ display: 'flex' }}>
                    <div className="comment-author">{accountName || "Guest"}</div>
                    <div>{commentedAt}</div>
                </div>
                {!isEditing && <div className="comment-text">{comment.content}</div>}
                {isEditing && (
                    <CommentForm
                        submitLabel="Update"
                        hasCancelButton
                        initialText={comment.content}
                        handleSubmit={(text) => updateComment(text, comment.commentId,comment.rootCommentId)}
                        handleCancel={() => setActiveComment(null)}
                    />
                )}
                <div className="comment-actions" style={{ display: 'flex' }}>
                    {canReply && (
                        <div
                            className="comment-action"
                            onClick={() => {
                                setActiveComment({ id: comment.commentId, type: "replying" })

                            }}
                        >
                            Reply
                        </div>

                    )}
                    {canEdit && (
                        <div
                            className="comment-action"
                            onClick={() => setActiveComment({ id: comment.commentId, type: "editing" })}
                        >
                            Edit
                        </div>
                    )}
                    {canDelete && (
                        <div
                            className="comment-action"
                            onClick={() => deleteComment(comment.commentId)}
                        >
                            Delete
                        </div>
                    )}
                </div>
                {isReplying && (
                    <CommentForm
                        submitLabel="Reply"
                        handleSubmit={(text) => addComment(text, replyId)}
                    />
                )}

                {replies.length > 0 && (
                    <div className='replies'>
                        {replies.map((reply) => (
                            <Comment
                                comment={reply}
                                key={reply.commentId}
                                reply={[]}
                                setActiveComment={setActiveComment}
                                activeComment={activeComment}
                                updateComment={updateComment}
                                deleteComment={deleteComment}
                                addComment={addComment}
                                rootCommentId={comment.commentId}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
};
Comment.propTypes = {
    comment: PropTypes.shape({
        commentId: PropTypes.number.isRequired,
        rootCommentId: PropTypes.number,
        content: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        bookId: PropTypes.number,
        ebookId: PropTypes.number,
        customerId: PropTypes.number.isRequired,
        recipeId: PropTypes.number,
        inverseRootComment: PropTypes.oneOfType([
            //PropTypes.string,
            PropTypes.array
        ]),
    }).isRequired,
    replies: PropTypes.arrayOf(
        PropTypes.shape({
            commentId: PropTypes.number.isRequired,
            rootCommentId: PropTypes.number,
            content: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            status: PropTypes.number.isRequired,
            bookId: PropTypes.number,
            ebookId: PropTypes.number,
            customerId: PropTypes.number.isRequired,
            recipeId: PropTypes.number,
            inverseRootComment: PropTypes.oneOfType([
                //PropTypes.string,
                PropTypes.array
            ]),
        })
    ),
    currentUserId: PropTypes.number.isRequired,
    updateComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    activeComment: PropTypes.any,
    addComment: PropTypes.func.isRequired,
    setActiveComment: PropTypes.func.isRequired,
    rootCommentId: PropTypes.number
};
export default Comment;