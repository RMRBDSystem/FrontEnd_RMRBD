import { useState } from "react";
const CommentForm = ({ handleSubmit , submitLabel,onClick, hasCancelButton = false, initialText = "", handleCancel }) => {
    const [text, setText] = useState(initialText);
    const isTextareaDisabled = text.length === 0;
    const onSubmit = event => {
        event.preventDefault();
        handleSubmit(text);
        setText("");
        if (onClick) onClick(); // Call the notification handler
    }
    return (
        <form onSubmit={onSubmit}>
            <textarea
                className="comment-form-textarea"
                style={{color: "black"}}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="comment-form-button" disabled={isTextareaDisabled}>
                {submitLabel}
            </button>
            {hasCancelButton && (
                <button
                    type="button"
                    className="comment-form-button comment-form-cancel-button"
                    onClick={handleCancel}
                >
                    Huỷ
                </button>
            )}
        </form>
    );
};
export default CommentForm;