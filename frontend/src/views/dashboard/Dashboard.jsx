import { useState, useEffect, useMemo } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";

import apiInstance from "../../utils/axios";
import moment from "moment";
import Toast from "../../plugin/toast";
import { useAuthStore } from "../../store/auth";

const LOGIN_STREAK_KEY = "chrono_dashboard_login_days";

const formatNumber = (value) =>
  new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value || 0);

const getPostUrl = (post) => `/post/${post.slug || post.blog}/`;

const getConsecutiveDayStreak = (dates) => {
  const validDates = dates
    .filter(Boolean)
    .map((date) => moment(date).format("YYYY-MM-DD"));

  if (validDates.length === 0) return 0;

  const uniqueDates = [...new Set(validDates)].sort().reverse();
  let cursor = moment(uniqueDates[0], "YYYY-MM-DD");
  let streak = 0;

  while (uniqueDates.includes(cursor.format("YYYY-MM-DD"))) {
    streak += 1;
    cursor = cursor.subtract(1, "day");
  }

  return streak;
};

const getCurrentLoginStreak = () => {
  const today = moment().format("YYYY-MM-DD");
  const storedDays = JSON.parse(localStorage.getItem(LOGIN_STREAK_KEY) || "[]");
  const days = [...new Set([...storedDays, today])].slice(-90);

  localStorage.setItem(LOGIN_STREAK_KEY, JSON.stringify(days));

  return getConsecutiveDayStreak(days);
};

function Dashboard() {
  const [stats, setStats] = useState({ views: 0, posts: 0, likes: 0, bookmarks: 0 });
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [noti, setNoti] = useState([]);
  const [loginStreak] = useState(getCurrentLoginStreak);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      if (!isLoggedIn) return;

      try {
        setLoading(true);
        setError(null);

        const [statsRes, postRes, commentRes, notiRes] = await Promise.all([
          apiInstance.get("author/dashboard/stats/"),
          apiInstance.get("author/dashboard/post-list/"),
          apiInstance.get("author/dashboard/comment-list/"),
          apiInstance.get("author/dashboard/noti-list/"),
        ]);

        if (!ignore) {
          const statsData = Array.isArray(statsRes.data) ? statsRes.data[0] : statsRes.data || {};
          const postsData = postRes.data?.results || postRes.data || [];
          const commentsData = commentRes.data?.results || commentRes.data || [];
          const notiData = notiRes.data?.results || notiRes.data || [];

          setStats({
            views: statsData.views || 0,
            posts: statsData.posts || 0,
            likes: statsData.likes || 0,
            bookmarks: statsData.bookmarks || 0,
          });

          setPosts(Array.isArray(postsData) ? postsData : []);
          setComments(Array.isArray(commentsData) ? commentsData : []);
          setNoti(Array.isArray(notiData) ? notiData : []);
        }
      } catch (err) {
        console.error("Dashboard error:", err);

        if (!ignore) {
          if (err.response?.status === 401) {
            navigate("/login");
          } else {
            setError("Failed to load dashboard data");
            Toast("error", "Failed to load dashboard");
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [isLoggedIn, navigate]);

  const analytics = useMemo(() => {
    const activityDates = [
      ...posts.map((post) => post.date),
      ...comments.map((comment) => comment.date),
      ...noti.map((notification) => notification.date),
    ];

    const weekActivity = Array.from({ length: 7 }).map((_, index) => {
      const date = moment().subtract(6 - index, "days");
      const key = date.format("YYYY-MM-DD");
      const count = activityDates.filter((itemDate) => moment(itemDate).format("YYYY-MM-DD") === key).length;

      return {
        label: date.format("ddd"),
        count,
      };
    });

    const topPosts = [...posts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    const maxPostViews = Math.max(...topPosts.map((post) => post.views || 0), 1);
    const maxActivity = Math.max(...weekActivity.map((day) => day.count), 1);
    const totalEngagement = (stats.likes || 0) + (stats.bookmarks || 0) + comments.length;
    const averageViews = stats.posts ? Math.round((stats.views || 0) / stats.posts) : 0;
    const activePosts = posts.filter((post) => post.status === "Active").length;
    const draftPosts = posts.filter((post) => post.status !== "Active").length;

    return {
      activityStreak: getConsecutiveDayStreak(activityDates),
      averageViews,
      totalEngagement,
      activePosts,
      draftPosts,
      weekActivity,
      topPosts,
      maxPostViews,
      maxActivity,
    };
  }, [posts, comments, noti, stats]);

  const handleMarkNotiAsSeen = async (notiId) => {
    try {
      await apiInstance.post("author/dashboard/noti-mark-seen/", {
        noti_id: notiId,
      });

      Toast("success", "Notification marked as seen");
      setNoti((prev) => prev.filter((n) => n.id !== notiId));
    } catch (err) {
      console.error(err);
      Toast("error", "Failed to update notification");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="dashboard-loading">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Preparing your analytics...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="dashboard-loading">
          <p className="text-danger">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="premium-dashboard">
        <div className="container-fluid">
          <div className="dashboard-hero">
            <div>
              <span className="dashboard-eyebrow">Author Command Center</span>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">
                Track story momentum, audience signals, and publishing consistency from one polished workspace.
              </p>
            </div>

            <div className="dashboard-hero-actions">
              <Link to="/posts" className="dashboard-secondary-btn">
                <i className="bi bi-journal-text"></i>
                Manage Posts
              </Link>
              <Link to="/addpost" className="dashboard-primary-btn">
                <i className="bi bi-plus-lg"></i>
                New Post
              </Link>
            </div>
          </div>

          <div className="dashboard-metrics-grid">
            {[
              { label: "Total Views", value: stats.views, icon: "bi-eye", tone: "blue", note: `${analytics.averageViews} avg per post` },
              { label: "Published Posts", value: stats.posts, icon: "bi-file-earmark-richtext", tone: "green", note: `${analytics.activePosts} active, ${analytics.draftPosts} draft` },
              { label: "Total Likes", value: stats.likes, icon: "bi-heart", tone: "rose", note: "Reader appreciation" },
              { label: "Bookmarks", value: stats.bookmarks, icon: "bi-bookmark", tone: "amber", note: "Saved for later" },
            ].map((item) => (
              <div className={`dashboard-metric-card ${item.tone}`} key={item.label}>
                <div className="dashboard-metric-icon">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div>
                  <p>{item.label}</p>
                  <h3>{formatNumber(item.value)}</h3>
                  <span>{item.note}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-analytics-grid">
            <div className="dashboard-panel dashboard-chart-panel">
              <div className="dashboard-panel-header">
                <div>
                  <h2>Weekly Activity</h2>
                  <p>Posts, comments, and notifications across the last 7 days.</p>
                </div>
                <span className="dashboard-pill">{analytics.activityStreak} day activity streak</span>
              </div>

              <div className="dashboard-bar-chart">
                {analytics.weekActivity.map((day) => (
                  <div className="dashboard-bar-column" key={day.label}>
                    <div className="dashboard-bar-track">
                      <div
                        className="dashboard-bar-fill"
                        style={{ height: `${Math.max((day.count / analytics.maxActivity) * 100, day.count ? 18 : 6)}%` }}
                      ></div>
                    </div>
                    <strong>{day.count}</strong>
                    <span>{day.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-panel dashboard-streak-panel">
              <div className="dashboard-panel-header compact">
                <div>
                  <h2>Consistency</h2>
                  <p>Keep the rhythm alive.</p>
                </div>
              </div>

              <div className="dashboard-streak-grid">
                <div className="dashboard-streak-card">
                  <span>Login Streak</span>
                  <strong>{loginStreak}</strong>
                  <p>consecutive days</p>
                </div>
                <div className="dashboard-streak-card">
                  <span>Activity Streak</span>
                  <strong>{analytics.activityStreak}</strong>
                  <p>content touchpoints</p>
                </div>
              </div>

              <div className="dashboard-engagement-ring">
                <div>
                  <strong>{formatNumber(analytics.totalEngagement)}</strong>
                  <span>engagements</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-content-grid">
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <div>
                  <h2>Top Stories</h2>
                  <p>Your highest-viewed posts.</p>
                </div>
                <Link to="/posts">View all</Link>
              </div>

              <div className="dashboard-top-posts">
                {analytics.topPosts.length === 0 ? (
                  <div className="dashboard-empty-state">No posts yet. Publish your first story to unlock analytics.</div>
                ) : (
                  analytics.topPosts.map((post, index) => (
                    <Link to={getPostUrl(post)} className="dashboard-top-post" key={post.id}>
                      <span className="dashboard-rank">{index + 1}</span>
                      <img src={post.image || "/images/default.png"} alt="" />
                      <div>
                        <h3>{post.title}</h3>
                        <p>{moment(post.date).format("DD MMM, YYYY")}</p>
                        <div className="dashboard-mini-track">
                          <span style={{ width: `${((post.views || 0) / analytics.maxPostViews) * 100}%` }}></span>
                        </div>
                      </div>
                      <strong>{formatNumber(post.views)} views</strong>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Notifications
              notifications={noti}
              comments={comments}
              limit={6}
              onNotificationSeen={handleMarkNotiAsSeen}
            />
          </div>

          <div className="dashboard-actions-strip">
            <Link to="/profile">
              <i className="bi bi-person-circle"></i>
              <span>
                <strong>Profile Settings</strong>
                <small>Update your identity and author details</small>
              </span>
              <em className="bi bi-arrow-right-short"></em>
            </Link>
            <Link to="/stories">
              <i className="bi bi-compass"></i>
              <span>
                <strong>Explore Stories</strong>
                <small>Browse published stories and ideas</small>
              </span>
              <em className="bi bi-arrow-right-short"></em>
            </Link>
            <Link to="/posts">
              <i className="bi bi-layout-text-window-reverse"></i>
              <span>
                <strong>Posts Library</strong>
                <small>Review, edit, and manage your posts</small>
              </span>
              <em className="bi bi-arrow-right-short"></em>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Dashboard;
