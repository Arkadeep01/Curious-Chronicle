import React, { useState, useEffect } from "react";
import { Eye, Heart, Bookmark, MessageSquare, Cloud } from "lucide-react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/toast";
import PostComments from "../dashboard/Comments";

function Detail() {
  const [post, setPost] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const param = useParams();
  const navigate = useNavigate();

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
    try {
      await apiInstance.post(`post/like/${post.id}/`);

      setPost((prev) => ({
        ...prev,
        Likes: [...(prev.Likes || []), {}],
      }));

      Toast("success", "Post liked");
    } catch (err) {
      console.log(err);
      Toast("error", "Failed to like post");
    }
  };

  const handleSavePost = async () => {
    try {
      await apiInstance.post(`post/save/${post.id}/`);

      Toast("success", "Post saved");
    } catch (err) {
      console.log(err);
      Toast("error", "Failed to save");
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

                <div>
                  <div className="detail-author-name">
                    {post.profile?.full_name}
                  </div>

                  <div className="detail-author-role">Author</div>
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
              <button className="detail-action-btn" onClick={handleLikePost}>
                <Heart className="action-icon" size={20} />
                <span>{post.Likes?.length || 0}</span>
              </button>

              <button className="detail-action-btn" onClick={handleSavePost}>
                <Bookmark className="action-icon" size={20} />
                <span>Save</span>
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
