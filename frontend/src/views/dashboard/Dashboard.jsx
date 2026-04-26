import { useState, useEffect } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import moment from "moment";
import Toast from "../../plugin/toast";

function Dashboard() {
    const [stats, setStats] = useState({});
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [noti, setNoti] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useUserData();
    const userId = user?.user_id;

    useEffect(() => {
        let ignore = false;

        const loadDashboard = async () => {
            try {
                setLoading(true);

                const [stats_res, post_res, comment_res, noti_res] = await Promise.all([
                    apiInstance.get(`author/dashboard/stats/${userId}/`),
                    apiInstance.get(`author/dashboard/post-list/${userId}/`),
                    apiInstance.get(`author/dashboard/comment-list/${userId}/`),
                    apiInstance.get(`author/dashboard/noti-list/${userId}/`)
                ]);

                if (!ignore) {
                    setStats(stats_res.data[0] || {});
                    setPosts(post_res.data || []);
                    setComments(comment_res.data || []);
                    setNoti(noti_res.data || []);
                }
            } catch (err) {
                console.error(err);
                Toast("error", "Failed to load dashboard");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        if (userId) loadDashboard();

        return () => {
            ignore = true;
        };
    }, [userId]);

    const handleMarkNotiAsSeen = async (notiId) => {
        try {
            await apiInstance.post("author/dashboard/noti-mark-seen/", {
                noti_id: notiId,
            });

            Toast("success", "Notification Seen");

            // update only notifications
            const res = await apiInstance.get(`author/dashboard/noti-list/${userId}/`);
            setNoti(res.data);
        } catch (err) {
            console.error(err);
            Toast("error", "Failed to update notification");
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="text-center mt-5">Loading dashboard...</div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            
            <section className="py-4">
                <div className="container">
                    <div className="row g-4">

                        {/* STATS */}
                        <div className="col-12">
                            <div className="row g-4">
                                {[
                                    { label: "Views", value: stats.views, icon: "bi-people-fill", color: "success" },
                                    { label: "Posts", value: stats.posts, icon: "bi-file-earmark-text-fill", color: "primary" },
                                    { label: "Likes", value: stats.likes, icon: "bi-suit-heart-fill", color: "danger" },
                                    { label: "Bookmarks", value: stats.bookmarks, icon: "bi-tag", color: "info" },
                                ].map((item, i) => (
                                    <div className="col-sm-6 col-lg-3" key={i}>
                                        <div className="card card-body border p-3">
                                            <div className="d-flex align-items-center">
                                                <div className={`icon-xl fs-1 p-3 bg-${item.color}-opacity-10 rounded-3 text-${item.color}`}>
                                                    <i className={`bi ${item.icon}`} />
                                                </div>
                                                <div className="ms-3">
                                                    <h3>{item.value || 0}</h3>
                                                    <h6 className="mb-0">{item.label}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* POSTS */}
                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header p-3">
                                    <h5>Posts ({posts.length})</h5>
                                </div>
                                <div className="card-body p-3">
                                    {posts.slice(0, 3).map((p) => (
                                        <div key={p.id}>
                                            <div className="d-flex">
                                                <img src={p.image} style={{ width: 80, height: 80, objectFit: "cover" }} alt="" />
                                                <div className="ms-2">
                                                    <h6>{p.title}</h6>
                                                    <small>{moment(p.date).format("DD MMM, YYYY")}</small>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    ))}
                                </div>
                                <div className="card-footer text-center">
                                    <Link to="/posts/">View all</Link>
                                </div>
                            </div>
                        </div>

                        {/* COMMENTS */}
                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header p-3">
                                    <h5>Comments ({comments.length})</h5>
                                </div>
                                <div className="card-body p-3">
                                    {comments.slice(0, 3).map((c) => (
                                        <div key={c.id}>
                                            <p>{c.comment}</p>
                                            <small>{c.name}</small>
                                            <hr />
                                        </div>
                                    ))}
                                </div>
                                <div className="card-footer text-center">
                                    <Link to="/comments/">View all</Link>
                                </div>
                            </div>
                        </div>

                        {/* NOTIFICATIONS */}
                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header p-3">
                                    <h5>Notifications</h5>
                                </div>
                                <div className="card-body p-3">
                                    {noti.slice(0, 3).map((n) => (
                                        <div key={n.id}>
                                            <p>{n.type}</p>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleMarkNotiAsSeen(n.id)}
                                            >
                                                Mark seen
                                            </button>
                                            <hr />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Dashboard;
