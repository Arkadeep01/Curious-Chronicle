import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../partials/header";
import Footer from "../partials/footer";

import TrendingSection from "../../components/TrendingSection";
import apiInstance from "../../utils/axios";

function Index() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        setLoading(true);

        const [postRes, catRes] = await Promise.all([
          apiInstance.get("post/lists/"),
          apiInstance.get("post/category/list/"),
        ]);

        if (!ignore) {
          setPosts(postRes.data);
          setCategory(catRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center mt-5">Loading posts...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            {/* LEFT CONTENT */}
            <div className="col-md-6">
              <h1 className="hero-title">
                Discover Ideas That <span>Shape Thinking</span>
              </h1>

              <p className="hero-subtitle">
                Explore curated stories on technology, culture, and innovation —
                crafted to inform, inspire, and empower curious minds.
              </p>

              {/* BUTTONS */}
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <Link to="/stories" className="hero-btn-primary">
                  Explore Stories →
                </Link>

                <Link to="/about" className="hero-btn-secondary">
                  Learn More
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-md-6 text-center">
              <div
                className="hero-card"
                onMouseMove={(e) => {
                  const img = e.currentTarget.querySelector(".hero-img");
                  const rect = e.currentTarget.getBoundingClientRect();

                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const rotateX = -(y / rect.height - 0.5) * 16;
                  const rotateY = (x / rect.width - 0.5) * 16;

                  img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector(".hero-img");
                  img.style.transform = "rotateX(0) rotateY(0)";
                }}
              >
                <img
                  src="/images/sub-hero.jpg"
                  alt="hero"
                  className="hero-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SIDEBAR SECTION */}
      <section className="category-section">
        <div className="container-fluid px-4 px-xl-5">
          <div className="row gx-5 gy-5">
            {/* SIDEBAR */}
            <div className="col-lg-3">
              <div className="category-card">
                <div className="category-header">
                  <span>↗</span>
                  <h5>CATEGORIES</h5>
                </div>

                <div className="category-list">
                  <Link to="/stories" className="category-item active">
                    <span>All Stories</span>
                    <span>{posts?.length || 0}</span>
                  </Link>

                  {category.map((c) => (
                    <Link
                      key={c.id}
                      to={`/category/${c.slug}/`}
                      className="category-item"
                    >
                      <span>{c.title}</span>
                      <span>{c.post_count || 0}</span>
                    </Link>
                  ))}
                </div>

                <div className="author-box">
                  <h4>Become an author</h4>

                  <p>Share your thoughts with thousands of curious readers.</p>

                  <Link to="/addpost" className="author-btn">
                    Start writing
                  </Link>
                </div>
              </div>
            </div>

            {/* TRENDING SECTION */}
            <div className="col-lg-9">
              <TrendingSection
                posts={posts}
                showHeader={true}
                withContainer={false}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Index;
