import { useState, useEffect} from "react"
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Cookies from 'js-cookie';
import { createComment, UpdateComment, RemoveComment } from "../services/CommentService"
import "../../assets/styles/Components/commentstyle.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getCommentsbyRecipeId} from "../services/CommentService"
const Comments = ({recipeId}) => {
    const accountId = Cookies.get("UserId");
    const [backendcomment, setbackendcomment] = useState([]); // All comments
    const [visibleComments, setVisibleComments] = useState(3); // Number of comments to display initially
    const [activeComment, setActiveComment] = useState(null); //  Tracks active comment for editing
    const Comments = backendcomment
        .filter((comment) => comment.rootCommentId === null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getReplies = (commentId) => {
        const replies = backendcomment
            .filter((comment) => comment.rootCommentId === commentId)
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );
        //console.log('Replies is: ', replies)
        return replies;
    }

    const deleteComment = (commentId) => {
        if (window.confirm("Are you sure that you want to remove comment?")) {
            RemoveComment(commentId).then(() => {
                const updatebackendComments = backendcomment.filter(
                    (comment) => comment.id !== commentId
                );
                setbackendcomment(updatebackendComments);
            })

        }
    };


    const updateComment = (text, commentId, rootcommentId) => {
        const updateCommentData = {
            rootcommentId,
            content: text,
            date: new Date().toISOString(),
            status: 1,
            bookId: null,
            ebookId: null,
            customerId: accountId,
            recipeId,
        };
        UpdateComment(updateCommentData, commentId).then(() => {
            const updatedBackendComments = backendcomment.map((backendComment) => {
                if (backendComment.id === commentId) {
                    return { ...backendComment, content: text };
                }
                return backendComment;
            });
            setbackendcomment(updatedBackendComments);
            setActiveComment(null);
        });
    }
    const handleWriteClick = (text) => {
        if (!accountId) {
            //alert("Vui lòng đăng nhập!!"); // Redirect to login page if not logged in
            toast.error(`Please log in to be able to comment!!`);
        } else {
            addComment(text); // Call your addComment function if logged in
        }
    };
    useEffect(() => {
        const fetchComment = async () => {
            try {
                getCommentsbyRecipeId(recipeId).then((data) => {
                    setbackendcomment(data);
                  });
            } catch (err) {
                console.error(err);
            }
        };
        fetchComment();    
    }, [recipeId]);
    const addComment = ((text, rootcommentId = null) => {

        const newCommentData = {
            rootcommentId,
            content: text,
            date: new Date().toISOString(),
            status: 1,
            bookId: null,
            ebookId: null,
            customerId: accountId,
            recipeId,
        };
        createComment(newCommentData).then((comment) => {
            setbackendcomment([comment, ...backendcomment]);
            setActiveComment(null);
        })
    });
    return (
        <>
            <ToastContainer />
            <div className="comments">
                <h3 className="comments-title">Comments</h3>
                <div className="comment-form-title">Write comment</div>
                <CommentForm submitLabel="Write" handleSubmit={handleWriteClick} />
                <div className="comments-container">
                    {Comments.map((comment) => {
                        return (
                            <Comment
                                key={comment.commentId}
                                comment={comment}
                                replies={getReplies(comment.commentId)}
                                activeComment={activeComment}
                                setActiveComment={setActiveComment}
                                addComment={addComment}
                                updateComment={updateComment}
                                deleteComment={deleteComment}
                                rootCommentId={comment.rootCommentId}
                                currentUserId={Number(accountId)}

                            />
                        );
                    })}
                </div>
                {visibleComments < Comments.length && (
                    <button
                        className="see-more-button"
                        onClick={() => setVisibleComments(visibleComments + 3)}
                    >
                        See more
                    </button>
                )}
            </div>
        </>
    );
};
export default Comments;