import { Link } from "react-router-dom";
import moment from "moment";

function TrendingSection({ posts = [], showHeader = true }) {
  const sortedPosts = [...posts].sort((a, b) => b.views - a.views);
  const heroPost = sortedPosts[0];
  const topPosts = sortedPosts.slice(0, 3);

  return (
    <section className="container mt-5">

      {/* CONDITIONAL HEADER */}
      {showHeader && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Trending Stories</h2>

          <Link to="/stories#trending-section" className="trending-link">
            View All →
          </Link>
        </div>
      )}

      <div className="row">

        {/* HERO POST */}
        {heroPost && (
          <div className="col-lg-6 mb-4">
            <div className="trending-hero">
              <img src={heroPost.image} alt="" />

              <div className="trending-overlay">
                <h3>{heroPost.title}</h3>
                <p>{heroPost.description?.slice(0, 100)}...</p>

                <div className="trending-meta">
                  <span>👁 {heroPost.views}</span>
                  <span>{moment(heroPost.date).format("DD MMM YYYY")}</span>
                </div>

                <Link to={`/post/${heroPost.slug}/`} className="read-btn">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* SIDE CARDS */}
        <div className="col-lg-6">
          {topPosts.slice(1).map((post) => (
            <div key={post.id} className="trending-card mb-3">
              <img src={post.image} alt="" />

              <div className="p-3">
                <h5>{post.title}</h5>
                <p className="text-muted small">
                  {post.description?.slice(0, 80)}...
                </p>

                <div className="d-flex justify-content-between small text-muted">
                  <span>👁 {post.views}</span>
                  <span>{moment(post.date).format("DD MMM")}</span>
                </div>

                <Link to={`/post/${post.slug}/`} className="read-link">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingSection;
