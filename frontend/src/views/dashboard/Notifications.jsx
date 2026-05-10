import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import apiInstance from "../../utils/axios";
import Toast from "../../plugin/toast";
import { useAuthStore } from "../../store/auth";

function Notifications({
  showAll = false,
  notifications,
  comments,
  limit,
  onNotificationSeen,
}) {
  const [noti, setNoti] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  const hasNotificationProps = Array.isArray(notifications);
  const hasCommentProps = Array.isArray(comments);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    let ignore = false;

    const loadNotifications = async () => {
      try {
        setLoading(true);

        const [notiResponse, commentResponse] = await Promise.all([
          hasNotificationProps
            ? Promise.resolve({ data: notifications })
            : apiInstance.get("author/dashboard/noti-list/", {
                params: showAll ? { seen: "all" } : {},
              }),
          hasCommentProps
            ? Promise.resolve({ data: comments })
            : apiInstance.get("author/dashboard/comment-list/"),
        ]);

        if (!ignore) {
          const notificationsData =
            notiResponse.data?.results || notiResponse.data || [];
          const commentsData =
            commentResponse.data?.results || commentResponse.data || [];

          setNoti(Array.isArray(notificationsData) ? notificationsData : []);
          setCommentList(Array.isArray(commentsData) ? commentsData : []);
        }
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          Toast("error", "Failed to load notifications");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (isLoggedIn) {
      loadNotifications();
    }

    return () => {
      ignore = true;
    };
  }, [
    comments,
    hasCommentProps,
    hasNotificationProps,
    isLoggedIn,
    navigate,
    notifications,
    showAll,
  ]);

  const handleMarkNotiAsSeen = async (notiId) => {
    try {
      if (onNotificationSeen) {
        await onNotificationSeen(notiId);
        return;
      }

      await apiInstance.post("author/dashboard/noti-mark-seen/", {
        noti_id: notiId,
      });

      setNoti((prev) =>
        showAll
          ? prev.map((n) => (n.id === notiId ? { ...n, seen: true } : n))
          : prev.filter((n) => n.id !== notiId),
      );

      Toast("success", "Notification marked as seen");
    } catch (err) {
      console.error(err);
      Toast("error", "Failed to update notification");
    }
  };

  const unreadCount = noti.filter((n) => !n.seen).length;
  const visibleNotifications = limit ? noti.slice(0, limit) : noti;
  const remainingSlots = limit
    ? Math.max(limit - visibleNotifications.length, 0)
    : commentList.length;
  const visibleComments = limit
    ? commentList.slice(0, remainingSlots)
    : commentList;

  if (loading) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-empty-state">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <h2>Notifications</h2>
          <p>Recent notifications and comments needing attention.</p>
        </div>

        <span className="dashboard-pill">{unreadCount} unread</span>
      </div>

      <div className="dashboard-inbox-list">
        {visibleNotifications.map((n) => (
          <div className="dashboard-inbox-item" key={n.id}>
            <div className="dashboard-inbox-icon">
              <i
                className={`bi ${
                  n.type === "Like"
                    ? "bi-heart"
                    : n.type === "Comment"
                      ? "bi-chat-left-text"
                      : "bi-bookmark"
                }`}
              ></i>
            </div>

            <div>
              <h3>{n.type}</h3>
              <p>
                {n.post?.title ? n.post.title.slice(0, 52) : "Post activity"}
              </p>
              <small>{n.date ? moment(n.date).fromNow() : "Just now"}</small>
            </div>

            {!n.seen ? (
              <button onClick={() => handleMarkNotiAsSeen(n.id)}>Seen</button>
            ) : (
              <span>Seen</span>
            )}
          </div>
        ))}

        {visibleComments.map((comment) => (
          <div className="dashboard-inbox-item" key={`comment-${comment.id}`}>
            <div className="dashboard-inbox-icon comment">
              <i className="bi bi-chat-dots"></i>
            </div>

            <div>
              <h3>{comment.name}</h3>
              <p>{comment.comment}</p>
              <small>{comment.post?.title || "Comment activity"}</small>
            </div>

            <span>{moment(comment.date).format("DD MMM")}</span>
          </div>
        ))}

        {noti.length === 0 && commentList.length === 0 && (
          <div className="dashboard-empty-state">
            No unread activity right now.
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
