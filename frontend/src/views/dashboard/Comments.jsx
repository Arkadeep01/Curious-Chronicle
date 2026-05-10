import React, { useState } from "react";
import { Send } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/toast";

function PostComments({ post, setPost, param }) {
  const [createComment, setCreateComment] = useState({
    comment: "",
  });

  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  const handleCreateCommentChange = (e) => {
    setCreateComment({
      ...createComment,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      Toast("warning", "Please login to comment");
      navigate("/login");
      return;
    }

    try {
      const payload = {
        post_id: post?.id,
        comment: createComment.comment,
      };

      await apiInstance.post(`post/comments/`, payload);

      Toast("success", "Comment posted successfully");

      setCreateComment({
        comment: "",
      });

      const res = await apiInstance.get(`post/details/${param.blog}/`);

      setPost(res.data);
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        Toast("error", "Failed to post comment");
      }
    }
  };

  return (
    <div className="detail-comments-section" id="comments">
      <h2 className="conversation-title">Conversation</h2>

      {/* COMMENT BOX */}
      <div className="conversation-input-wrapper">
        <div className="conversation-avatar">G</div>

        <form
          onSubmit={handleCreateCommentSubmit}
          className="conversation-form"
        >
          <textarea
            name="comment"
            value={createComment.comment}
            onChange={handleCreateCommentChange}
            placeholder="Share your thoughts..."
            className="conversation-textarea"
            required
          />

          <button type="submit" className="conversation-submit-btn">
            <Send size={16} />

            <span>Post</span>
          </button>
        </form>
      </div>

      {/* COMMENTS LIST */}
      <div className="conversation-comments-list">
        {post?.comments?.map((comment, index) => (
          <div key={index} className="conversation-comment-item">
            <div className="conversation-avatar">
              {comment?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div className="conversation-comment-content">
              <div className="conversation-comment-top">
                <h5>{comment.name}</h5>

                <span>{moment(comment.date).format("MMM D, YYYY")}</span>
              </div>

              <p>{comment.comment}</p>

              {comment.reply && (
                <div className="conversation-author-reply">
                  <strong>Author Reply</strong>

                  <p>{comment.reply}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostComments;
