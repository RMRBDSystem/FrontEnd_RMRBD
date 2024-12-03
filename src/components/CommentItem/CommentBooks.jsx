import { useState, useEffect} from "react"
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Cookies from 'js-cookie';
import { createComment, UpdateComment, RemoveComment,getCommentsbyBookId } from "../services/CommentService"
import "../../assets/styles/Components/commentstyle.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useSocket} from "../../App"
import {createNotification} from "../services/NotificationService"
import {getAccountById} from "../services/AccountService"
import {getBookById} from "../services/BookService"
const Comments = ({bookId,createById}) => {
    const accountId = Cookies.get("UserId");
    const [backendComments, setBackendComments] = useState([]); // All comments
    const [visibleComments, setVisibleComments] = useState(3); // Number of comments to display initially
    const [activeComment, setActiveComment] = useState(null); //  Tracks active comment for editing
    const backgroundPromise = [];
    const [createbyName,setCreatebyName] =useState(null);
    const [book, setBook] = useState(null)
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

    const { socket, accountOnline } = useSocket();
    const handleNotification = (text) => {
        socket.emit("sendNotification", {
            senderName: accountOnline,
            receiverName: createbyName,
            content:text,
        });
        const addNotification = () => {
            const newNotificationData = {
                accountId: createById,
                content: text,
                date: new Date().toISOString(),
                status: 1,
            };
            createNotification(newNotificationData); // Không cần await
        };
        addNotification();
    };

    useEffect(() => {
        const fetchComment = async () => {
            try {
                await Promise.all(backgroundPromise)
                const data = await getCommentsbyBookId(bookId);
                const receiverName = await getAccountById(createById);
                const bookdata = await getBookById(bookId);
                setBook(bookdata)
                setCreatebyName(receiverName.userName);
                setBackendComments(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComment();    
    }, [bookId,backgroundPromise,createById]);
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
                <CommentForm 
                submitLabel="Write" 
                handleSubmit={handleWriteClick} 
                onClick={() => handleNotification(`${accountOnline} commented on your ${book.bookName} book`)} 
                />
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
                                createByUserId= {Number(createById)}
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