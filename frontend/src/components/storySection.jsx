import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

function StorySection({
  posts = [],
  title = "Stories",
  showHeader = true,
  withContainer = true,
}) {
  const navigate = useNavigate();

  const heroPost = posts[0];
  const sidePosts = posts.slice(1, 3);
  const remainingPosts = posts.slice(3);

  const cleanText = (html = "") => {
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleAuthorNavigate = (e, profileId) => {
    e.stopPropagation();

    if (profileId) {
      navigate(`/author/${profileId}/`);
    }
  };

  return (
    <section className={withContainer ? "container mt-5" : "w-100 p-0 m-0"}>
      {/* HEADER */}
      {showHeader && (
        <div className="stories-section-header">
          <h2 className="stories-section-title">{title}</h2>

          <Link to="/stories" className="stories-section-link">
            {posts.length} posts
          </Link>
        </div>
      )}

      {/* HERO + SIDE */}
      <div className="row g-4">
        {/* HERO */}
        {heroPost && (
          <div className="col-12">
            <div
              className="trending-hero-card"
              onClick={() => navigate(`/post/${heroPost.slug}/`)}
            >
              <div className="row g-0 align-items-stretch">
                {/* IMAGE */}
                <div className="col-lg-6">
                  <div className="image-glass-wrapper">
                    <img
                      src={heroPost.image}
                      alt={heroPost.title}
                      className="trending-hero-image"
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="col-lg-6">
                  <div className="trending-hero-body">
                    <div className="trending-badge">
                      {heroPost.category?.title || "Featured"}
                    </div>

                    <h1 className="trending-hero-title">{heroPost.title}</h1>

                    <p className="trending-hero-description">
                      {cleanText(heroPost.description).slice(0, 180)}
                      ...
                    </p>

                    <div className="trending-hero-footer">
                      {/* AUTHOR */}
                      <div className="trending-author-wrapper">
                        <span
                          className="trending-author clickable-author"
                          onClick={(e) =>
                            handleAuthorNavigate(e, heroPost.profile?.id)
                          }
                        >
                          {heroPost.profile?.full_name ||
                            heroPost.user?.full_name ||
                            "Curious Chronicle Team"}
                        </span>

                        <div className="trending-author-bio">
                          Author
                          {heroPost.profile?.bio &&
                            ` | ${heroPost.profile.bio}`}
                        </div>
                      </div>

                      {/* META */}
                      <div className="trending-meta">
                        <span>👁 {heroPost.views}</span>

                        <span>
                          {moment(heroPost.date).format("MMM D, YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIDE POSTS */}
        {sidePosts.map((post) => (
          <div key={post.id} className="col-lg-6">
            <div
              className="trending-small-card"
              onClick={() => navigate(`/post/${post.slug}/`)}
            >
              <div className="image-glass-wrapper">
                <img
                  src={post.image}
                  alt={post.title}
                  className="trending-small-image"
                />
              </div>

              <div className="trending-small-body">
                <div className="trending-small-top">
                  <div className="trending-small-badge">
                    {post.category?.title || "Technology"}
                  </div>

                  <div className="trending-small-views">👁 {post.views}</div>
                </div>

                <h3>{post.title}</h3>

                <p>
                  {cleanText(post.description).slice(0, 100)}
                  ...
                </p>

                <div className="trending-author-wrapper">
                  <span
                    className="trending-author clickable-author"
                    onClick={(e) => handleAuthorNavigate(e, post.profile?.id)}
                  >
                    {post.profile?.full_name || "Curious Chronicle Team"}
                  </span>

                  <div className="trending-author-bio">
                    Author
                    {post.profile?.bio && ` | ${post.profile.bio}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GRID POSTS */}
      {remainingPosts.length > 0 && (
        <div className="row g-4 mt-2">
          {remainingPosts.map((post) => (
            <div key={post.id} className="col-lg-4 col-md-6">
              <div
                className="story-grid-card"
                onClick={() => navigate(`/post/${post.slug}/`)}
              >
                <div className="image-glass-wrapper">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="story-grid-image"
                  />
                </div>

                <div className="story-grid-body">
                  <div className="story-grid-category">
                    {post.category?.title || "Technology"}
                  </div>

                  <h4>{post.title}</h4>

                  <div className="trending-author-wrapper mt-2">
                    <span
                      className="trending-author clickable-author"
                      onClick={(e) => handleAuthorNavigate(e, post.profile?.id)}
                    >
                      {post.profile?.full_name || "Curious Chronicle Team"}
                    </span>

                    <div className="trending-author-bio">
                      Author
                      {post.profile?.bio && ` | ${post.profile.bio}`}
                    </div>
                  </div>

                  <p className="mt-3">
                    {cleanText(post.description).slice(0, 90)}
                    ...
                  </p>

                  <div className="story-grid-footer">
                    <span>👁 {post.views}</span>

                    <span>{moment(post.date).format("MMM D")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default StorySection;
