import { useState, useEffect, useMemo } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import moment from "moment";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    const user = useUserData();
    const userId = user?.user_id;

    // ✅ FIXED EFFECT
    useEffect(() => {
        let ignore = false;

        const loadPosts = async () => {
            try {
                const res = await apiInstance.get(
                    `author/dashboard/post-list/${userId}/`
                );

                if (!ignore) setPosts(res.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        if (userId) loadPosts();

        return () => {
            ignore = true;
        };
    }, [userId]);

    // ✅ DERIVED STATE (NO MUTATION)
    const processedPosts = useMemo(() => {
        let data = [...posts];

        // search
        if (search) {
            data = data.filter((p) =>
                p.title.toLowerCase().includes(search.toLowerCase())
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

    return (
        <>
            <Header />

            <section className="py-4">
                <div className="container">
                    <div className="card">

                        {/* HEADER */}
                        <div className="card-header d-flex justify-content-between">
                            <h5>
                                Posts{" "}
                                <span className="badge bg-primary">
                                    {processedPosts.length}
                                </span>
                            </h5>

                            <Link to="/AddPost/" className="btn btn-primary btn-sm">
                                Add New
                            </Link>
                        </div>

                        <div className="card-body">

                            {/* SEARCH + SORT */}
                            <div className="row mb-3">
                                <div className="col-md-8">
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="Search posts..."
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <select
                                        className="form-select"
                                        onChange={(e) => setSort(e.target.value)}
                                    >
                                        <option value="">Sort</option>
                                        <option value="Newest">Newest</option>
                                        <option value="Oldest">Oldest</option>
                                    </select>
                                </div>
                            </div>

                            {/* TABLE */}
                            <div className="table-responsive">
                                <table className="table table-hover">

                                    <thead className="table-dark">
                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Views</th>
                                            <th>Date</th>
                                            <th>Category</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {processedPosts.map((p) => (
                                            <tr key={p.id}>
                                                <td>
                                                    <img
                                                        src={p.image}
                                                        style={{
                                                            width: 80,
                                                            height: 80,
                                                            objectFit: "cover",
                                                            borderRadius: 8,
                                                        }}
                                                        alt=""
                                                    />
                                                </td>

                                                <td>
                                                    <Link
                                                        to={`/detail/${p.slug}/`}
                                                        className="text-dark"
                                                    >
                                                        {p.title}
                                                    </Link>
                                                </td>

                                                <td>{p.view}</td>

                                                <td>
                                                    {moment(p.date).format(
                                                        "DD MMM, YYYY"
                                                    )}
                                                </td>

                                                <td>{p.category?.title}</td>

                                                <td>
                                                    <span className="badge bg-secondary">
                                                        {p.status}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Link
                                                            to={`/edit-post/${p.id}/`}
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button className="btn btn-sm btn-danger">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {processedPosts.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="text-center">
                                                    No posts found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Posts;