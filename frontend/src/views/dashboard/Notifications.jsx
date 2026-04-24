import { useState, useEffect } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/toast";

function Notifications() {
    const [noti, setNoti] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useUserData();
    const userId = user?.user_id;

    // ✅ FIXED EFFECT
    useEffect(() => {
        let ignore = false;

        const loadNotifications = async () => {
            try {
                setLoading(true);

                const response = await apiInstance.get(
                    `author/dashboard/noti-list/${userId}/`
                );

                if (!ignore) {
                    setNoti(response.data || []);
                }
            } catch (err) {
                console.error(err);
                Toast("error", "Failed to load notifications");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        if (userId) loadNotifications();

        return () => {
            ignore = true;
        };
    }, [userId]);

    // ✅ MARK AS SEEN
    const handleMarkNotiAsSeen = async (notiId) => {
        try {
            await apiInstance.post(
                "author/dashboard/noti-mark-seen/",
                { noti_id: notiId }
            );

            Toast("success", "Notification seen");

            // update only this notification (no full refetch)
            setNoti((prev) =>
                prev.filter((n) => n.id !== notiId)
            );

        } catch (err) {
            console.error(err);
            Toast("error", "Failed to update notification");
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="text-center mt-5">Loading notifications...</div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <section className="py-5">
                <div className="container">
                    <div className="card">

                        <div className="card-header">
                            <h3>Notifications</h3>
                            <small>Manage your activity</small>
                        </div>

                        <div className="card-body">
                            <ul className="list-group">

                                {noti.length === 0 && (
                                    <p className="text-center">No notifications yet</p>
                                )}

                                {noti.map((n) => (
                                    <li key={n.id} className="list-group-item mb-3 shadow-sm rounded">

                                        <div className="d-flex align-items-start">

                                            {/* ICON */}
                                            <div className="me-3">
                                                {n.type === "Like" && (
                                                    <i className="fas fa-thumbs-up text-primary fs-5" />
                                                )}
                                                {n.type === "Comment" && (
                                                    <i className="bi bi-chat-left-quote-fill text-success fs-5" />
                                                )}
                                                {n.type === "Bookmark" && (
                                                    <i className="fas fa-bookmark text-danger fs-5" />
                                                )}
                                            </div>

                                            {/* CONTENT */}
                                            <div className="flex-grow-1">
                                                <h6>{n.type}</h6>

                                                {n.type === "Like" && (
                                                    <div>
                                                        Someone liked your post{" "}
                                                        <b>{n.post?.title?.slice(0, 30)}...</b>
                                                    </div>
                                                )}

                                                {n.type === "Comment" && (
                                                    <div>
                                                        New comment on{" "}
                                                        <b>{n.post?.title?.slice(0, 30)}...</b>
                                                    </div>
                                                )}

                                                {n.type === "Bookmark" && (
                                                    <div>
                                                        Someone bookmarked{" "}
                                                        <b>{n.post?.title?.slice(0, 30)}...</b>
                                                    </div>
                                                )}

                                                <small className="text-muted">Just now</small>

                                                <div>
                                                    <button
                                                        onClick={() => handleMarkNotiAsSeen(n.id)}
                                                        className="btn btn-sm btn-secondary mt-2"
                                                    >
                                                        Mark as seen
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

export default Notifications;
