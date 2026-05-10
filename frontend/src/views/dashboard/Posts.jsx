import { useState, useEffect, useMemo } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link, useNavigate } from "react-router-dom";

import apiInstance from "../../utils/axios";
import moment from "moment";
import { useAuthStore } from "../../store/auth";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [_loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    let ignore = false;

    const loadPosts = async () => {
      try {
        setLoading(true);
        const res = await apiInstance.get("author/dashboard/post-list/");

        if (!ignore) {
          setPosts(res.data?.results || res.data || []);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (isLoggedIn) loadPosts();

    return () => {
      ignore = true;
    };
  }, [isLoggedIn, navigate]);

  // ✅ DERIVED STATE (NO MUTATION)
  const processedPosts = useMemo(() => {
    let data = [...posts];

    // search
    if (search) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // sort
    if (sort === "Newest") {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === "Oldest") {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return data;
  }, [posts, search, sort]);

  const getPostUrl = (post) => `/post/${post.slug || post.blog}/`;

  return (
    <>
      <Header />

      <section className="posts-page">
        <div className="container-fluid">
          {/* ================= HEADER ================= */}

          <div className="posts-topbar">
            <div>
              <h1 className="posts-page-title">Your Posts</h1>

              <p className="posts-page-subtitle">
                Manage, edit and monitor all your published stories.
              </p>
            </div>

            <Link to="/addpost/" className="posts-create-btn">
              <i className="fas fa-plus"></i>
              Create Post
            </Link>
          </div>

          {/* ================= MAIN CARD ================= */}

          <div className="posts-main-card">
            {/* HEADER */}

            <div className="posts-card-header">
              <div className="posts-count-wrapper">
                <h4 className="posts-card-title">Posts Library</h4>

                <span className="posts-count-badge">
                  {processedPosts.length}
                </span>
              </div>

              {/* SEARCH + SORT */}

              <div className="posts-toolbar">
                <div className="posts-search-box">
                  <i className="fas fa-search"></i>

                  <input
                    type="search"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="posts-sort-box">
                  <i className="fas fa-filter"></i>

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="">Sort</option>
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* POSTS GRID */}
            <div className="posts-grid">
              {processedPosts.map((p) => (
                <div className="post-card-modern" key={p.id}>
                  {/* IMAGE */}

                  <Link
                    to={getPostUrl(p)}
                    className="post-card-image-wrapper"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="post-card-image"
                    />

                    <div className="post-card-status">{p.status}</div>
                  </Link>

                  {/* BODY */}
                  <div className="post-card-body">
                    <div className="post-card-meta">
                      <span>
                        <i className="far fa-eye"></i>
                        {p.views}
                      </span>

                      <span>
                        <i className="far fa-calendar"></i>
                        {moment(p.date).format("DD MMM YYYY")}
                      </span>
                    </div>

                    <Link to={getPostUrl(p)} className="post-card-title">
                      {p.title}
                    </Link>

                    <div className="post-card-category">
                      {p.category?.title}
                    </div>

                    {/* ACTIONS */}

                    <div className="post-card-actions">
                      <Link
                        to={`/edit-post/${p.id}/`}
                        className="post-action-btn edit"
                      >
                        <i className="fas fa-pen"></i>
                        Edit
                      </Link>

                      <button className="post-action-btn delete">
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* EMPTY */}

            {processedPosts.length === 0 && (
              <div className="posts-empty-state">
                <i className="far fa-folder-open"></i>

                <h4>No posts found</h4>
                <p>Try changing search or create a new post.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Posts;
