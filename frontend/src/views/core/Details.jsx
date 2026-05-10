import React, { useState, useEffect } from "react";
import { Eye, Heart, Bookmark, MessageSquare } from "lucide-react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/toast";
import PostComments from "../dashboard/Comments";
import { useAuthStore } from "../../store/auth";

function Detail() {
  const [post, setPost] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const param = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const response = await apiInstance.get(`post/details/${param.blog}/`);

        setPost(response.data);

        const tagArray = response.data?.tags
          ? response.data.tags.split(",")
          : [];

        setTags(tagArray);
      } catch (error) {
        console.error("Error fetching post:", error);

        if (error.response?.status === 404) {
          navigate("/not-found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [param.blog, navigate]);

  const handleLikePost = async () => {
    if (!isLoggedIn) {
      Toast("warning", "Please login to like posts");
      navigate("/login");
      return;
    }

    if (actionLoading) return;

    try {
      setActionLoading(true);
      const response = await apiInstance.post("post/likes-post/", { post_id: post.id });
      
      const isLiked = response.data.message === "Post Liked";
      
      setPost((prev) => ({
        ...prev,
        user_has_liked: isLiked,
        Likes: isLiked 
          ? [...(prev.Likes || []), { id: Date.now() }] 
          : (prev.Likes || []).slice(0, -1),
      }));

      Toast("success", isLiked ? "Post liked" : "Post unliked");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        Toast("error", "Failed to update like");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSavePost = async () => {
    if (!isLoggedIn) {
      Toast("warning", "Please login to save posts");
      navigate("/login");
      return;
    }

    if (actionLoading) return;

    try {
      setActionLoading(true);
      const response = await apiInstance.post("post/bookmarks/", { post_id: post.id });
      
      const isBookmarked = response.data.message === "Post Bookmarked";
      
      setPost((prev) => ({
        ...prev,
        user_has_bookmarked: isBookmarked,
      }));

      Toast("success", isBookmarked ? "Post saved" : "Post removed from saved");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        Toast("error", "Failed to save post");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const scrollToComments = () => {
    document.getElementById("comments")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center mt-5">Loading post...</div>
        <Footer />
      </>
    );
  }

  const isLiked = post?.user_has_liked || false;
  const isBookmarked = post?.user_has_bookmarked || false;

  return (
    <>
      <Header />

      <div className="detail-page">
        <section className="detail-hero">
          <div className="detail-container">
            {/* TOP META */}
            <div className="detail-top-meta">
              <span className="detail-category">{post.category?.title}</span>
            </div>

            {/* TITLE */}
            <h1 className="detail-title">{post.title}</h1>

            {/* AUTHOR */}
            <div className="detail-author-row">
              <div className="detail-author-left">
                <img
                  src={post.profile?.image}
                  className="detail-author-image"
                  alt=""
                />

                <div className="detail-author-content">
                  <div
                    className="detail-author-name clickable-author"
                    onClick={() => navigate(`/author/${post.profile?.id}/`)}
                  >
                    {post.profile?.full_name}
                  </div>

                  <div className="detail-author-role">
                    Author
                    {post.profile?.bio && ` | ${post.profile.bio}`}
                  </div>
                </div>
              </div>

              <div className="detail-author-stats">
                <span>
                  <Eye /> {post.views}
                </span>

                <span className="detail-date">
                  {moment(post.date).format("MMMM D, YYYY")}
                </span>
              </div>
            </div>

            {/* FEATURE IMAGE */}
            <img
              src={post.image}
              className="detail-feature-image"
              alt={post.title}
            />

            {/* CONTENT */}
            <div
              className="detail-content"
              dangerouslySetInnerHTML={{
                __html: post.description,
              }}
            />

            {/* TAGS */}
            {tags.length > 0 && (
              <div className="detail-tags">
                <span className="detail-tags-label">Tags</span>

                <div className="detail-tags-wrapper">
                  {tags.map((tag, index) => (
                    <span key={index} className="detail-tag">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION BAR */}
            <div className="detail-action-bar">
              <button 
                className={`detail-action-btn ${isLiked ? 'active' : ''}`} 
                onClick={handleLikePost}
                disabled={actionLoading}
              >
                <Heart 
                  className="action-icon" 
                  size={20} 
                  fill={isLiked ? "currentColor" : "none"}
                />
                <span>{post.Likes?.length || 0}</span>
              </button>

              <button 
                className={`detail-action-btn ${isBookmarked ? 'active' : ''}`} 
                onClick={handleSavePost}
                disabled={actionLoading}
              >
                <Bookmark 
                  className="action-icon" 
                  size={20} 
                  fill={isBookmarked ? "currentColor" : "none"}
                />
                <span>{isBookmarked ? "Saved" : "Save"}</span>
              </button>

              <button className="detail-action-btn" onClick={scrollToComments}>
                <MessageSquare className="action-icon" size={19} />
                <span>{post.comments?.length || 0}</span>
              </button>
            </div>

            {/* COMMENTS */}
            <PostComments post={post} setPost={setPost} param={param} />
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Detail;