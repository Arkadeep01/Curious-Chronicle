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

    const popularPosts = useMemo(() => {
        return [...posts].sort((a, b) => b.views - a.views);
    }, [posts]);

    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const postItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return posts.slice(start, start + itemsPerPage);
    }, [posts, currentPage]);

    const totalPages = Math.ceil(posts.length / itemsPerPage);

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

                        const rotateX = -(y / rect.height - 0.5) * 12;
                        const rotateY = (x / rect.width - 0.5) * 12;

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
