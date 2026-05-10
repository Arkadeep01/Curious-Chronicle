import { useEffect, useState, useRef } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link, useNavigate, useParams } from "react-router-dom";

import apiInstance from "../../utils/axios";
import Toast from "../../plugin/toast";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store/auth";

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

  const navigate = useNavigate();
  const { id } = useParams();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  const editorRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const [postRes, catRes] = await Promise.all([
          apiInstance.get(`author/dashboard/post-detail/${id}/`),
          apiInstance.get("post/category/list/"),
        ]);

        if (!ignore) {
          setEditPost({
            ...postRes.data,
            category: postRes.data?.category?.id || "",
          });
          setCategoryList(catRes.data);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          Toast("error", "Failed to load data");
        }
      }
    };

    if (isLoggedIn && id) loadData();

    return () => {
      ignore = true;
    };
  }, [isLoggedIn, id, navigate]);

  const handleChange = (e) => {
    setEditPost((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (!post.title || !post.description) {
      Toast("error", "Title and description required");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description);
      formData.append("tags", post.tags);
      formData.append("category", post.category?.id || post.category);
      formData.append("post_status", post.status);

      if (post.image instanceof File) {
        formData.append("image", post.image);
      }

      await apiInstance.patch(`author/dashboard/post-detail/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

            <div className="edit-post-editor-wrapper">
              <label className="edit-post-label">Post Description</label>

              <div
                ref={editorRef}
                className="edit-post-html-editor"
                contentEditable
                suppressContentEditableWarning={true}
                dangerouslySetInnerHTML={{
                  __html: post.description || "",
                }}
                onBlur={() =>
                  setEditPost((prev) => ({
                    ...prev,
                    description: editorRef.current.innerHTML,
                  }))
                }
              />
            </div>

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
              className={`btn w-100 ${isLoading ? "btn-secondary" : "btn-warning"}`}
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
