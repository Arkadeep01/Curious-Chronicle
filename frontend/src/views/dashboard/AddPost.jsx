import React, { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Link2,
  Image,
  CalendarDays,
  Clock12,
  PenTool,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "../partials/header";
import Footer from "../partials/footer";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/toast";
import Swal from "sweetalert2";

function AddPost() {
  const location = useLocation();
  const [post, setCreatePost] = useState({
    image: null,
    title: "",
    slug: "",
    content: "",
    category: "",
    tags: "",
    status: "Draft",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(new Date());
  const [wordCount, setWordCount] = useState(0);

  const user = useUserData();
  const userId = user?.user_id || user?.id;
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const editorRef = useRef(null);
  const editorContentRef = useRef("");

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const getEditorContent = () =>
    editorRef.current?.innerHTML || editorContentRef.current || "";

  const getWordCount = (text = "") => {
    const cleanText = text.replace(/\s+/g, " ").trim();
    return cleanText === "" ? 0 : cleanText.split(" ").length;
  };

  const handleSaveDraft = () => {
    if (!userId) return;

    const draftKey = `chrono_blog_draft_${userId}`;

    const draftData = {
      title: post.title,
      slug: post.slug,
      category: post.category,
      tags: post.tags,
      status: post.status,
      imagePreview,
      content: getEditorContent(),
    };

    localStorage.setItem(draftKey, JSON.stringify(draftData));

    setIsDraftSaved(true);
    setLastSavedTime(new Date());
    Toast("success", "Draft saved");
  };


  useEffect(() => {
    if (!userId) return;

    const draftKey = `chrono_blog_draft_${userId}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);

      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setCreatePost((prev) => ({
        ...prev,
        title: parsedDraft.title || "",
        slug: parsedDraft.slug || "",
        category: parsedDraft.category || "",
        tags: parsedDraft.tags || "",
        status: parsedDraft.status || "Draft",
      }));

      setImagePreview(parsedDraft.imagePreview || "");

      setTimeout(() => {
        if (editorRef.current) {
          const savedContent = parsedDraft.content || "";
          editorRef.current.innerHTML = savedContent;
          editorContentRef.current = savedContent;
          setWordCount(getWordCount(editorRef.current.innerText));
        }
      }, 0);

      setIsDraftSaved(true);
    }
  }, [userId]);


  useEffect(() => {
    document.execCommand("styleWithCSS", false, true);
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    let ignore = false;
    const fetchCategory = async () => {
      try {
        const response = await apiInstance.get("post/category/list/");

        if (!ignore) {
          setCategoryList(response.data);
        }
      } catch (err) {
        console.error(err);

        Toast("error", "Failed to load categories");
      }
    };
    fetchCategory();
    return () => {
      clearInterval(interval);
      ignore = true;
    };
  }, []);

  
  const handleCreatePostChange = (e) => {
    const { name, value } = e.target;
    setCreatePost((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      if (name === "title") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return updated;
    });
  };

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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const editorContent = getEditorContent();

    if (!userId) {
      Toast("error", "You must be logged in");
      return;
    }
    if (!post.title || !editorContent || !post.image || !post.category) {
      Toast("error", "Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("title", post.title);
      formData.append("slug", post.slug);
      formData.append("image", post.image);
      formData.append("description", editorContent);
      formData.append("tags", post.tags);
      formData.append("category", post.category);
      formData.append("post_status", post.status);

      await apiInstance.post("author/dashboard/post-create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.removeItem(`chrono_blog_draft_${userId}`);

      Swal.fire({
        icon: "success",
        title: "Post published successfully",
      });
      navigate("/posts/");
    } catch (err) {
      console.error(err);
      Toast("error", "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!location.state?.message) return;
  
    Toast("success", location.state.message);
  
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  
    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  
    return () => clearTimeout(timer);
  
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
  
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <Header />

      <div className="write-page">
        {/* OUTER CONTAINER */}
        <section className="write-shell">
          {/* NAVBAR */}
          <div className="write-navbar">
            <div className="write-left">
              <div className="write-status">
                {isDraftSaved ? "Draft Saved" : "Draft Not Saved"} ·{" "}
                {(() => {
                  const now = new Date(currentTime);

                  const diffInMinutes = Math.floor(
                    (now - lastSavedTime) / 1000 / 60,
                  );

                  const diffInHours = Math.floor(diffInMinutes / 60);

                  if (diffInMinutes < 1) {
                    return "just now";
                  }

                  if (diffInMinutes === 1) {
                    return "1 min ago";
                  }

                  if (diffInMinutes < 60) {
                    return `${diffInMinutes} mins ago`;
                  }

                  if (diffInHours === 1) {
                    return "1 hour ago";
                  }

                  return `${diffInHours} hours ago`;
                })()}
              </div>
            </div>

            <div className="write-actions">
              <button
                type="button"
                className="preview-btn"
                onClick={() => {
                  navigate("/preview", {
                    state: {
                      post: {
                        ...post,
                        content: getEditorContent(),
                      },
                      imagePreview,
                    },
                  });
                }}
              >
                Preview
              </button>
              <button
                type="button"
                className="draft-btn"
                onClick={handleSaveDraft}
              >
                Save draft
              </button>

              <button
                type="submit"
                form="create-post-form"
                className="publish-btn"
                disabled={isLoading || !userId}
              >
                {isLoading ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>

          {/* MAIN */}
          <div className="write-container">
            <div className="write-grid">
              {/* LEFT SIDE */}
              <div className="contentEditable">
                {/* TOOLBAR */}
                <div className="editor-toolbar">
                  <button
                    className="toolbar-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatText("formatBlock", "h1");
                    }}
                  >
                    {" "}
                    H1{" "}
                  </button>
                  <button
                    className="toolbar-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatText("formatBlock", "h2");
                    }}
                  >
                    {" "}
                    H2{" "}
                  </button>
                  <button
                    className="toolbar-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatText("bold");
                    }}
                  >
                    B
                  </button>
                  <button
                    className="toolbar-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatText("italic");
                    }}
                  >
                    I
                  </button>
                  <button
                    className="toolbar-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatText("underline");
                    }}
                  >
                    U
                  </button>
                  <button
                    className="toolbar-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatText("insertUnorderedList");
                    }}
                  >
                    •
                  </button>
                  {/* <button
                    className="toolbar-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatText("formatBlock", "<blockquote>");
                    }}
                  >
                    “ ”
                  </button> */}
                  <button
                    className="toolbar-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      formatText("createLink", prompt("Enter URL"));
                    }}
                  >
                    <Link2 />{" "}
                  </button>
                  <button className="ai-btn">
                    <Sparkles /> AI assist
                  </button>
                </div>

                <form id="create-post-form" onSubmit={handleCreatePost}>
                  <label className="cover-upload">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt=""
                        className="cover-preview"
                      />
                    ) : (
                      <>
                        <div className="cover-icon">
                          {" "}
                          <Image />{" "}
                        </div>
                        <h4>Add a cover image</h4>
                        <p>
                          Drag & drop or click to upload · 1600×840 recommended
                        </p>
                      </>
                    )}
                    <input type="file" hidden onChange={handleFileChange} />
                  </label>

                  {/* TITLE */}
                  <textarea
                    rows="1"
                    type="text"
                    name="title"
                    className="story-title"
                    placeholder="An untitled story..."
                    value={post.title}
                    onChange={handleCreatePostChange}
                  />

                  {/* META */}
                  <div className="story-meta">
                    <span style={{ color: "#818cf8" }}>
                      <CalendarDays /> {new Date().toDateString()}
                    </span>
                    <span style={{ color: "#a78bfa" }}>
                      <Clock12 /> {Math.max(1, Math.ceil(wordCount / 200))} min
                      read{" "}
                    </span>
                    <span style={{ color: "#c084fc" }}>
                      <PenTool /> {wordCount} words
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="story-editor"
                    data-placeholder="Tell your story..."
                    spellCheck={true}
                    role="textbox"
                    onInput={(e) => {
                      editorContentRef.current = e.currentTarget.innerHTML;
                      setWordCount(getWordCount(e.currentTarget.innerText));
                    }}
                  ></div>
                </form>
              </div>

              {/* SIDEBAR */}
              <div className="write-sidebar">
                {/* SETTINGS */}
                <div className="sidebar-card">
                  <h4>Post settings</h4>

                  {/* STATUS */}
                  <div className="status-tabs">
                    <button
                      type="button"
                      className={`status-tab ${
                        post.status === "Draft" ? "active" : ""
                      }`}
                      onClick={() =>
                        setCreatePost((prev) => ({
                          ...prev,
                          status: "Draft",
                        }))
                      }
                    >
                      Draft
                    </button>

                    <button
                      type="button"
                      className={`status-tab ${
                        post.status === "Disabled" ? "active" : ""
                      }`}
                      onClick={() =>
                        setCreatePost((prev) => ({
                          ...prev,
                          status: "Disabled",
                        }))
                      }
                    >
                      Disabled
                    </button>

                    <button
                      type="button"
                      className={`status-tab ${
                        post.status === "Active" ? "active" : ""
                      }`}
                      onClick={() =>
                        setCreatePost((prev) => ({
                          ...prev,
                          status: "Active",
                        }))
                      }
                    >
                      Active
                    </button>
                  </div>

                  {/* SLUG */}
                  <div className="setting-group">
                    <label>URL slug</label>

                    <input
                      type="text"
                      name="slug"
                      className="setting-input"
                      value={post.slug}
                      onChange={handleCreatePostChange}
                    />
                  </div>

                  {/* CATEGORY */}
                  <div className="setting-group">
                    <label>Category</label>

                    <select
                      name="category"
                      className="setting-input"
                      value={post.category}
                      onChange={handleCreatePostChange}
                    >
                      <option value="">Select category</option>

                      {categoryList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* TAGS */}
                  <div className="setting-group">
                    <label>Tags</label>

                    <input
                      type="text"
                      name="tags"
                      className="setting-input"
                      placeholder="design, tech..."
                      value={post.tags}
                      onChange={handleCreatePostChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default AddPost;
