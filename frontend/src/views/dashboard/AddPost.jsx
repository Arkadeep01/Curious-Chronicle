import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";

function AddPost() {
    const [post, setCreatePost] = useState({
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

    // ✅ Fetch category (safe)
    useEffect(() => {
        let ignore = false;

        const fetchCategory = async () => {
            try {
                const response = await apiInstance.get("post/category/list/");
                if (!ignore) setCategoryList(response.data);
            } catch (err) {
                console.error(err);
                Toast("error", "Failed to load categories");
            }
        };

        fetchCategory();

        return () => {
            ignore = true;
        };
    }, []);

    // ✅ Handle text inputs
    const handleCreatePostChange = (e) => {
        setCreatePost((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // ✅ Handle image upload safely
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setCreatePost((prev) => ({
            ...prev,
            image: file,
        }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // ✅ Create post
    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!userId) {
            Toast("error", "You must be logged in");
            return;
        }

        if (!post.title || !post.description || !post.image || !post.category) {
            Toast("error", "All fields are required");
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("title", post.title);
            formData.append("image", post.image);
            formData.append("description", post.description);
            formData.append("tags", post.tags);
            formData.append("category", post.category);
            formData.append("post_status", post.status);

            await apiInstance.post("author/dashboard/post-create/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                icon: "success",
                title: "Post created successfully",
            });

            navigate("/posts/");
        } catch (err) {
            console.error(err);
            Toast("error", "Failed to create post");
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
                        <h2>Create Chronicle Post</h2>
                        <p>Write and publish your article</p>
                    </div>

                    <form onSubmit={handleCreatePost}>

                        {/* Preview */}
                        <img
                            src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
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
                            className="form-control mb-3"
                            placeholder="Post Title"
                            onChange={handleCreatePostChange}
                        />

                        {/* Category */}
                        <select
                            name="category"
                            className="form-select mb-3"
                            onChange={handleCreatePostChange}
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
                            className="form-control mb-3"
                            rows="6"
                            placeholder="Write your post..."
                            onChange={handleCreatePostChange}
                        />

                        {/* Tags */}
                        <input
                            name="tags"
                            className="form-control mb-3"
                            placeholder="tags (comma separated)"
                            onChange={handleCreatePostChange}
                        />

                        {/* Status */}
                        <select
                            name="status"
                            className="form-select mb-3"
                            onChange={handleCreatePostChange}
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
                            {isLoading ? "Creating..." : "Create Post"}
                        </button>

                    </form>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default AddPost;