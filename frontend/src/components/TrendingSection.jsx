import { Link } from "react-router-dom";
import moment from "moment";

function TrendingSection({ posts = [], showHeader = true, withContainer = true }) {
  const sortedPosts = [...posts].sort((a, b) => b.views - a.views);
  const heroPost = sortedPosts[0];
  const topPosts = sortedPosts.slice(0, 3);

  return (
    <section className={withContainer ? "container mt-5" : "w-100 p-0 m-0"}>

      {/* HEADER SECTION - FIXED FOR CORNER LOCK */}
      {showHeader && (
        <div className="trending-header-row">
          <h2 className="trending-main-title">Trending Stories</h2>
          <Link to="/stories#trending-section" className="trending-view-link">
            View All →
          </Link>
        </div>
      )}

      <div className="row g-4 trending-content-grid m-0">
        {/* HERO POST */}
        {heroPost && (
          <div className="col-xl-8 mb-4 px-0">
            <div className="trending-hero-wrapper">
              <img src={heroPost.image} alt={heroPost.title} className="w-100" />
              <div className="trending-hero-overlay">
                <h3>{heroPost.title}</h3>
                <p>{heroPost.description?.slice(0, 100)}...</p>
                <div className="trending-hero-meta">
                  <span>👁 {heroPost.views}</span>
                  <span>{moment(heroPost.date).format("DD MMM YYYY")}</span>
                </div>
                <Link to={`/post/${heroPost.slug}/`} className="trending-hero-btn">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* SIDE CARDS */}
        <div className="col-xl-4 pe-0">
          {topPosts.slice(1).map((post) => (
            <div key={post.id} className="trending-mini-card mb-3">
              <img src={post.image} alt={post.title} />
              <div className="trending-mini-body">
                <h5>{post.title}</h5>
                <p className="text-muted small">
                  {post.description?.slice(0, 80)}...
                </p>
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>👁 {post.views}</span>
                  <span>{moment(post.date).format("DD MMM")}</span>
                </div>
                <Link to={`/post/${post.slug}/`} className="trending-mini-link">
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