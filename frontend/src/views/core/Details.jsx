import React, { useState, useEffect } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/toast";

function Detail() {
    const [post, setPost] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    const [createComment, setCreateComment] = useState({
        full_name: "",
        email: "",
        comment: "",
    });

    const param = useParams();
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);

                const response = await apiInstance.get(`post/details/${param.slug}/`);

                setPost(response.data);

                const tagArray = response.data?.tags
                    ? response.data.tags.split(",")
                    : [];

                setTags(tagArray);

            } catch (error) {
                console.error("Error fetching post:", error);

                // ✅ redirect to 404 page
                if (error.response?.status === 404) {
                    navigate("/not-found");
                }

            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [param.slug, navigate]);

    const handleCreateCommentChange = (e) => {
        setCreateComment({
            ...createComment,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                post_id: post?.id,
                name: createComment.full_name,
                email: createComment.email,
                comment: createComment.comment,
            };

            await apiInstance.post(`post/comments/`, payload);

            Toast("success", "Comment posted successfully");

            setCreateComment({
                full_name: "",
                email: "",
                comment: "",
            });

            // Refresh post
            const res = await apiInstance.get(`post/details/${param.slug}/`);
            setPost(res.data);

        } catch (error) {
            Toast("error", "Failed to post comment");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="text-center mt-5">Loading post...</div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <section className="mt-5">
                <div className="container text-center">
                    <span className="badge bg-danger mb-2">
                        {post.category?.title}
                    </span>
                    <h1>{post.title}</h1>
                </div>
            </section>

            <section className="container mt-4">
                <div className="row">

                    {/* Sidebar */}
                    <div className="col-lg-3">
                        <img
                            src={post.profile?.image}
                            className="rounded-circle mb-2"
                            style={{ width: 80, height: 80, objectFit: "cover" }}
                            alt=""
                        />
                        <h5>{post.profile?.full_name}</h5>
                        <p className="text-muted small">{post.profile?.bio}</p>

                        <ul className="list-unstyled small">
                            <li>{moment(post.date).format("DD MMM YYYY")}</li>
                            <li>{post.views} views</li>
                            <li>{post.Likes?.length || 0} likes</li>
                        </ul>

                        {/* Tags */}
                        <div>
                            {tags.map((t, i) => (
                                <span key={i} className="badge bg-light text-dark me-1">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="col-lg-9">
                        <div dangerouslySetInnerHTML={{ __html: post.description }} />

                        <hr />

                        {/* Comments */}
                        <h4>{post.comments?.length || 0} Comments</h4>

                        {post.comments?.map((c, i) => (
                            <div key={i} className="p-3 bg-light rounded mb-3">
                                <strong>{c.name}</strong>
                                <div className="small text-muted">
                                    {moment(c.date).format("DD MMM YYYY")}
                                </div>
                                <p>{c.comment}</p>
                                {c.reply && <p className="text-primary">Reply: {c.reply}</p>}
                            </div>
                        ))}

                        {/* Form */}
                        <form onSubmit={handleCreateCommentSubmit}>
                            <input
                                name="full_name"
                                value={createComment.full_name}
                                onChange={handleCreateCommentChange}
                                placeholder="Name"
                                className="form-control mb-2"
                                required
                            />

                            <input
                                name="email"
                                value={createComment.email}
                                onChange={handleCreateCommentChange}
                                placeholder="Email"
                                type="email"
                                className="form-control mb-2"
                                required
                            />

                            <textarea
                                name="comment"
                                value={createComment.comment}
                                onChange={handleCreateCommentChange}
                                placeholder="Comment"
                                className="form-control mb-2"
                                required
                            />

                            <button className="btn btn-primary">
                                Post Comment
                            </button>
                        </form>

                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Detail;
