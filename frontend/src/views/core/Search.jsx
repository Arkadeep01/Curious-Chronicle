import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import Header from "../partials/header";
import Footer from "../partials/footer";
import apiInstance from "../../utils/axios";

function Search() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await apiInstance.get("post/lists/");
        setPosts(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load posts from the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return posts;

    return posts.filter((post) => {
      const title = post.title?.toLowerCase() || "";
      const author = post.profile?.full_name?.toLowerCase() || "";
      const category = post.category?.title?.toLowerCase() || "";

      return title.includes(value) || author.includes(value) || category.includes(value);
    });
  }, [posts, query]);

  return (
    <div>
      <Header />

      <section className="p-0">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="text-start d-block mt-1">
                <i className="fas fa-search"></i> Search Articles
              </h2>
              <input
                type="search"
                className="form-control"
                placeholder="Search by title, author, or category"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-0 mt-4">
        <div className="container">
          {loading && <p className="text-start">Loading posts...</p>}
          {error && <p className="text-start text-danger">{error}</p>}
          {!loading && !error && filteredPosts.length === 0 && (
            <p className="text-start">No posts found.</p>
          )}

          <div className="row">
            {filteredPosts.map((post) => (
              <div className="col-sm-6 col-lg-3" key={post.id}>
                <div className="card mb-4">
                  <div className="card-fold position-relative">
                    <img
                      className="card-img"
                      style={{ width: "100%", height: "160px", objectFit: "cover" }}
                      src={post.image}
                      alt={post.title}
                    />
                  </div>
                  <div className="card-body px-3 pt-3">
                    <h4 className="card-title">
                      <Link
                        to={`/${post.slug}/`}
                        className="btn-link text-reset stretched-link fw-bold text-decoration-none"
                      >
                        {post.title?.slice(0, 40)}
                        {post.title?.length > 40 ? "..." : ""}
                      </Link>
                    </h4>
                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                      <li>
                        <span className="text-dark text-decoration-none">
                          <i className="fas fa-user"></i> {post.profile?.full_name || "Unknown"}
                        </span>
                      </li>
                      <li className="mt-2">
                        <i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}
                      </li>
                      <li className="mt-2">
                        <i className="fas fa-eye"></i> {post.views} Views
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Search;
