import { useState, useEffect, useMemo } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link } from "react-router-dom";
import moment from "moment";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/toast";

function Index() {
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useUserData(); 

    useEffect(() => {
        let ignore = false;

        const loadData = async () => {
            try {
                setLoading(true);

                const [postRes, catRes] = await Promise.all([
                    apiInstance.get("post/lists/"),
                    apiInstance.get("post/category/list/")
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

    // ✅ DERIVED DATA (NO STATE)
    const popularPosts = useMemo(() => {
        return [...posts].sort((a, b) => b.views - a.views);
    }, [posts]);

    // Pagination
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const postItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return posts.slice(start, start + itemsPerPage);
    }, [posts, currentPage]);

    const totalPages = Math.ceil(posts.length / itemsPerPage);

    // ✅ FIXED: NO HOOK INSIDE FUNCTION
    const handleLikePost = async (postId) => {
        try {
            const res = await apiInstance.post("post/likes-post/", {
                user_id: user?.user_id,
                post_id: postId,
            });

            Toast("success", res.data.message);
        } catch (err) {
            console.error(err);
            Toast("error", "Like failed");
        }
    };

    const handleBookmarkPost = async (postId) => {
        try {
            const res = await apiInstance.post("post/bookmarks/", {
                user_id: user?.user_id,
                post_id: postId,
            });

            Toast("success", res.data.message);
        } catch (err) {
            console.error(err);
            Toast("error", "Bookmark failed");
        }
    };

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

            {/* Trending */}
            <section className="container mt-4">
                <h2>Trending Articles 🔥</h2>
                <div className="row">
                    {postItems.map((p) => (
                        <div className="col-lg-3 col-md-6" key={p.id}>
                            <div className="card mb-4 shadow-sm">
                                <img
                                    src={p.image}
                                    className="card-img-top"
                                    style={{ height: 180, objectFit: "cover" }}
                                    alt={p.title}
                                />

                                <div className="card-body">
                                    <Link to={`/${p.slug}/`} className="fw-bold text-dark text-decoration-none">
                                        {p.title?.slice(0, 50)}...
                                    </Link>

                                    <div className="mt-2 small text-muted">
                                        {p.profile?.full_name}
                                    </div>

                                    <div className="small text-muted">
                                        {moment(p.date).format("DD MMM YYYY")}
                                    </div>

                                    <div className="small text-muted">
                                        {p.views} views
                                    </div>

                                    <div className="mt-2 d-flex gap-2">
                                        <button onClick={() => handleLikePost(p.id)} className="btn btn-sm btn-outline-primary">
                                            👍 {p.Likes?.length || 0}
                                        </button>

                                        <button onClick={() => handleBookmarkPost(p.id)} className="btn btn-sm btn-outline-danger">
                                            🔖
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-4">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage((p) => p - 1)}>
                                Previous
                            </button>
                        </li>

                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage((p) => p + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Categories */}
            <section className="container mt-5">
                <h2>Categories</h2>
                <div className="d-flex flex-wrap gap-3">
                    {category.map((c) => (
                        <Link key={c.id} to={`/category/${c.slug}/`}>
                            <div className="card text-center p-2">
                                <img src={c.image} style={{ width: 120, height: 70 }} alt="" />
                                <h6>{c.title}</h6>
                                <small>{c.post_count} Articles</small>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Popular */}
            <section className="container mt-5 mb-5">
                <h2>Popular Articles 🕒</h2>
                <div className="row">
                    {popularPosts.map((p) => (
                        <div className="col-lg-3 col-md-6" key={p.id}>
                            <div className="card mb-3">
                                <img src={p.image} className="card-img-top" alt="" />
                                <div className="card-body">
                                    <Link to={`/${p.slug}/`} className="text-decoration-none">
                                        {p.title?.slice(0, 40)}...
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Index;
