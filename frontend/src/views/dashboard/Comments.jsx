import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";

function Comments() {
    const [comments, setComments] = useState([]);
    const [replyMap, setReplyMap] = useState({}); 
    
    useEffect(() => {
      let ignore = false;
  
      const loadComments = async () => {
          try {
              const response = await apiInstance.get("author/dashboard/comment-list/");
  
              if (!ignore) {
                  setComments(response.data); 
              }
          } catch (err) {
              console.error(err);
              Toast("error", "Failed to load comments");
          }
      };
  
      loadComments();
  
      return () => {
          ignore = true;
      };
  }, []);

    const handleReplyChange = (id, value) => {
        setReplyMap((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmitReply = async (commentId) => {
      try {
          const replyText = replyMap[commentId];
  
          if (!replyText) {
              Toast("error", "Reply cannot be empty");
              return;
          }
  
          await apiInstance.post("author/dashboard/reply-comment/", {
              comment_id: commentId,
              reply: replyText,
          });
  
          Toast("success", "Reply sent");
  
          // clear only that reply
          setReplyMap((prev) => ({
              ...prev,
              [commentId]: "",
          }));
  
          const response = await apiInstance.get("author/dashboard/comment-list/");
          setComments(response.data);
  
      } catch (err) {
          console.error(err);
          Toast("error", "Failed to send reply");
      }
  };
    return (
        <>
            <Header />

            <section className="py-5">
                <div className="container">
                    <div className="card">
                        <div className="card-header">
                            <h3>Comments</h3>
                            <small>Manage your comments</small>
                        </div>

                        <div className="card-body">
                            <ul className="list-group">

                                {comments.map((c) => (
                                    <li key={c.id} className="list-group-item mb-3 shadow-sm rounded">

                                        <div className="d-flex">
                                            <img
                                                src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                                                className="rounded-circle me-3"
                                                style={{ width: 60, height: 60 }}
                                                alt=""
                                            />

                                            <div className="w-100">
                                                <h5>{c.name}</h5>
                                                <small>{Moment(c.date)}</small>

                                                <p className="mt-2">
                                                    <strong>Comment → </strong> {c.comment}
                                                </p>

                                                <p className="mt-2">
                                                    <strong>Response → </strong>
                                                    {c.reply ? (
                                                        c.reply
                                                    ) : (
                                                        <span className="text-danger ms-2">No reply</span>
                                                    )}
                                                </p>

                                                {/* Collapse */}
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#reply-${c.id}`}
                                                >
                                                    Reply
                                                </button>

                                                <div className="collapse mt-3" id={`reply-${c.id}`}>
                                                    <textarea
                                                        className="form-control mb-2"
                                                        rows="3"
                                                        placeholder="Write reply..."
                                                        value={replyMap[c.id] || ""}
                                                        onChange={(e) =>
                                                            handleReplyChange(c.id, e.target.value)
                                                        }
                                                    />

                                                    <button
                                                        onClick={() => handleSubmitReply(c.id)}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Comments;