import { useState, useEffect } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { FaUser, FaCalendarAlt, FaEye } from "react-icons/fa";

import apiInstance from "../../utils/axios";

function Category() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const param = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let ignore = false;

    const loadPosts = async () => {
      try {
        setLoading(true);

        const response = await apiInstance.get(
          `post/category/posts/${param.blog}/`,
          { params: { page: currentPage } }
        );

        if (!ignore) {
          const data = response.data;
          setPosts(data?.results || data || []);
          setTotalPages(data?.total_pages || 1);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      ignore = true;
    };
  }, [param.blog, currentPage]);

  const indexOfLastItem = currentPage * 4;
  const indexOfFirstItem = indexOfLastItem - 4;
  const postItems = posts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Header />

      {/* Category Header */}
      <section className="py-4 bg-light border-bottom">
        <div className="container">
          <h2 className="fw-bold">
            {posts[0]?.category?.title || "Category"}
            <span className="text-muted fs-6 ms-2">
              ({posts.length} Articles)
            </span>
          </h2>
        </div>
      </section>

      {/* Posts */}
      <section className="py-5">
        <div className="container">
          {loading ? (
            <p className="text-center">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted">
              No posts found in this category.
            </p>
          ) : (
            <div className="row">
              {postItems.map((p, index) => (
                <div className="col-sm-6 col-lg-3" key={index}>
                  <div className="card mb-4 border-0 shadow-sm h-100 hover-card">
                    <img
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                      src={p.image}
                      alt={p.title}
                    />

                    <div className="card-body">
                      <h5 className="fw-bold">
                        <Link
                          to={`/post/${p.slug || p.blog}/`}
                          className="text-decoration-none text-dark"
                        >
                          {p.title.length > 50
                            ? p.title.slice(0, 50) + "..."
                            : p.title}
                        </Link>
                      </h5>

                      <div className="mt-3 small text-muted">
                        <div className="d-flex align-items-center gap-2">
                          <FaUser />
                          {p?.profile?.full_name}
                        </div>

                        <div className="d-flex align-items-center gap-2 mt-2">
                          <FaCalendarAlt />
                          {moment(p.date).format("DD MMM YYYY")}
                        </div>

                        <div className="d-flex align-items-center gap-2 mt-2">
                          <FaEye />
                          {p.views} views
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Optional Styling */}
      <style>
        {`
                .hover-card {
                    transition: all 0.3s ease;
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                }
                `}
      </style>
    </>
  );
}

export default Category;
