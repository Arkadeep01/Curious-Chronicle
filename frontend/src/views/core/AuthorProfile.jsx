import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../partials/header";
import Footer from "../partials/footer";
import apiInstance from "../../utils/axios";
import moment from "moment";

import { Heart, MessageCircle, MapPin } from "lucide-react";

function AuthorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadAuthor = async () => {
      try {
        setLoading(true);

        const authorRes = await apiInstance.get(`user/profile/${id}/`);

        const postRes = await apiInstance.get(`post/lists/`);

        if (!ignore) {
          setAuthor(authorRes.data);

          const allPosts = postRes.data?.results || postRes.data || [];

          const authorPosts = allPosts.filter(
            (p) => p.profile?.id === authorRes.data?.id,
          );

          setPosts(authorPosts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (id) loadAuthor();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-5">Loading Author...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="author-profile-page">
        <div className="container">
          {/* TOP PROFILE */}
          <div className="author-profile-top">
            {/* IMAGE */}
            <img
              src={
                author?.image ||
                "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
              }
              alt=""
              className="author-profile-image"
            />

            {/* NAME */}
            <h1 className="author-profile-name">
              {author?.full_name || author?.user?.full_name}
            </h1>

            {/* COUNTRY */}
            {author?.country && (
              <div className="author-country">
                <MapPin size={15} />
                <span>{author.country}</span>
              </div>
            )}
            
            {/* BIO */}
            {author?.bio && <p className="author-profile-bio">{author.bio}</p>}

            {/* ABOUT */}
            {author?.about && (
              <p className="author-profile-about">{author.about}</p>
            )}

            {/* SOCIALS */}
            <div className="author-profile-socials">
              {author?.facebook && (
                <a
                  href={author.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="author-social-btn"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}

              {author?.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="author-social-btn"
                >
                  <i className="fab fa-twitter"></i>
                </a>
              )}
            </div>

            {/* ACTIONS */}
            <div className="author-profile-actions">
              <button className="author-follow-btn">Follow</button>

              <button className="author-message-btn">Message</button>
            </div>
          </div>

          {/* STATS */}
          <div className="author-stats-card">
            <div className="author-stat-item">
              <h2>{posts.length}</h2>

              <span>Posts</span>
            </div>

            <div className="author-stat-divider"></div>

            <div className="author-stat-item">
              <h2>{author?.followers_count || 0}</h2>

              <span>Followers</span>
            </div>
          </div>

          {/* RECENT STORIES */}
          <div className="author-posts-section">
            <div className="author-posts-top">
              <h3>Recent Stories</h3>

              <button className="author-view-all">View All</button>
            </div>

            <div className="row g-4">
              {posts.map((post) => (
                <div key={post.id} className="col-12">
                  <div
                    className="author-story-card"
                    onClick={() => navigate(`/post/${post.slug}/`)}
                  >
                    <div className="author-story-category">
                      {post.category?.title}
                    </div>

                    <h2>{post.title}</h2>

                    <p>
                      {post.description?.replace(/<[^>]*>/g, " ").slice(0, 160)}
                      ...
                    </p>

                    <div className="author-story-footer">
                      <div className="author-story-meta">
                        <span>👁 {post.views}</span>

                        <span>
                          <Heart size={15} /> {post.Likes?.length || 0}
                        </span>

                        <span>
                          <MessageCircle size={15} />{" "}
                          {post.comments?.length || 0}
                        </span>
                      </div>

                      <div>{moment(post.date).format("MMM D, YYYY")}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AuthorProfile;
