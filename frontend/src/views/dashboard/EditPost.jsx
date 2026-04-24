import { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";

function EditPost() {
    const [post, setEditPost] = useState({
        image: null,
        title: "",
        description: "",
        category: "",
        tags: "",
        status: "Active",
    });

    const [imagePreview, setImagePreview] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const user = useUserData();
    const userId = user?.user_id;

    const navigate = useNavigate();
    const { id } = useParams();

    // ✅ FIXED EFFECT
    useEffect(() => {
        let ignore = false;

        const loadData = async () => {
            try {
                const [postRes, catRes] = await Promise.all([
                    apiInstance.get(`author/dashboard/post-detail/${userId}/${id}/`),
                    apiInstance.get("post/category/list/"),
                ]);

                if (!ignore) {
                    setEditPost(postRes.data);
                    setCategoryList(catRes.data);
                }
            } catch (err) {
                console.error(err);
                Toast("error", "Failed to load data");
            }
        };

        if (userId && id) loadData();

        return () => {
            ignore = true;
        };
    }, [userId, id]);

    // ✅ HANDLE INPUT
    const handleChange = (e) => {
        setEditPost((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // ✅ HANDLE IMAGE
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setEditPost((prev) => ({
            ...prev,
            image: file,
        }));

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    // ✅ UPDATE POST
    const handleUpdatePost = async (e) => {
        e.preventDefault();

        if (!post.title || !post.description) {
            Toast("error", "Title and description required");
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("title", post.title);
            formData.append("description", post.description);
            formData.append("tags", post.tags);
            formData.append("category", post.category);
            formData.append("post_status", post.status);

            // only append image if changed
            if (post.image instanceof File) {
                formData.append("image", post.image);
            }

            await apiInstance.patch(
                `author/dashboard/post-detail/${userId}/${id}/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            Swal.fire({
                icon: "success",
                title: "Post updated successfully",
            });

            navigate("/posts/");
        } catch (err) {
            console.error(err);
            Toast("error", "Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />

            <section className="py-5">
                <div className="container">

                    <div className="bg-primary text-white p-4 rounded mb-4">
                        <h2>Update Chronicle Post</h2>
                        <p>Edit your article details</p>
                    </div>

                    <form onSubmit={handleUpdatePost}>

                        {/* Preview */}
                        <img
                            src={imagePreview || post.image}
                            className="mb-3 w-100 rounded"
                            style={{ height: 300, objectFit: "cover" }}
                            alt="preview"
                        />

                        {/* Image */}
                        <input
                            type="file"
                            className="form-control mb-3"
                            onChange={handleFileChange}
                        />

                        {/* Title */}
                        <input
                            name="title"
                            value={post.title || ""}
                            onChange={handleChange}
                            className="form-control mb-3"
                            placeholder="Title"
                        />

                        {/* Category */}
                        <select
                            name="category"
                            value={post.category || ""}
                            onChange={handleChange}
                            className="form-select mb-3"
                        >
                            <option value="">Select Category</option>
                            {categoryList.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>

                        {/* Description */}
                        <textarea
                            name="description"
                            value={post.description || ""}
                            onChange={handleChange}
                            className="form-control mb-3"
                            rows="6"
                        />

                        {/* Tags */}
                        <input
                            name="tags"
                            value={post.tags || ""}
                            onChange={handleChange}
                            className="form-control mb-3"
                        />

                        {/* Status */}
                        <select
                            name="status"
                            value={post.status || "Active"}
                            onChange={handleChange}
                            className="form-select mb-3"
                        >
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Disabled">Disabled</option>
                        </select>

                        {/* Submit */}
                        <button
                            className={`btn w-100 ${isLoading ? "btn-secondary" : "btn-success"}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Post"}
                        </button>

                    </form>

                </div>
            </section>

            <Footer />
        </>
    );
}

export default EditPost;