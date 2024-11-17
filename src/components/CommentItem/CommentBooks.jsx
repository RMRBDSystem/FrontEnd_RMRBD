import { useState, useEffect} from "react"
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Cookies from 'js-cookie';
import { createComment, UpdateComment, RemoveComment,getCommentsbyBookId } from "../services/CommentService"
import "../../assets/styles/Components/commentstyle.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Comments = ({bookId}) => {
    const accountId = Cookies.get("UserId");
    const [backendComments, setBackendComments] = useState([]); // All comments
    const [visibleComments, setVisibleComments] = useState(3); // Number of comments to display initially
    const [activeComment, setActiveComment] = useState(null); //  Tracks active comment for editing
    const backgroundPromise = [];
    const Comments = backendComments
        .filter((comment) => comment.rootCommentId === null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getReplies = (commentId) => {
        const replies = backendComments
            .filter((comment) => comment.rootCommentId === commentId)
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );
        //console.log('Replies is: ', replies)
        return replies;
    }

    const deleteComment = async (commentId) => {
        if (window.confirm("Are you sure that you want to remove comment?")) {
            await RemoveComment(commentId);
            setBackendComments(backendComments.filter((comment) => comment.id !== commentId));
            backgroundPromise.push(backendComments)

        }
    };


    const updateComment = async (text, commentId, rootcommentId) => {
        const updateCommentData = {
            rootcommentId,
            content: text,
            date: new Date().toISOString(),
            status: 1,
            bookId,
            ebookId: null,
            customerId: accountId,
            recipeId: null,
        };
        await UpdateComment(updateCommentData, commentId);
        setBackendComments(backendComments.map((comment) =>
            comment.id === commentId ? { ...comment, content: text } : comment
        ));
        backgroundPromise.push(backendComments)
        setActiveComment(null);
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
                await Promise.all(backgroundPromise)
                const data = await getCommentsbyBookId(bookId);
                setBackendComments(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComment();    
    }, [bookId,backgroundPromise]);
    const addComment = async (text, rootcommentId = null) => {

        const newCommentData = {
            rootcommentId,
            content: text,
            date: new Date().toISOString(),
            status: 1,
            bookId,
            ebookId: null,
            customerId: accountId,
            recipeId: null,
        };
        const comment = await createComment(newCommentData);
        setBackendComments([comment, ...backendComments]);
        backgroundPromise.push(backendComments)
        setActiveComment(null);
    };
    return (
        <>
            <ToastContainer />
            <div className="comments">
                <h3 className="comments-title">Comments</h3>
                <div className="comment-form-title">Write comment</div>
                <CommentForm submitLabel="Write" handleSubmit={handleWriteClick} />
                <div className="comments-container">
                    {Comments.slice(0, visibleComments).map((comment) => {
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