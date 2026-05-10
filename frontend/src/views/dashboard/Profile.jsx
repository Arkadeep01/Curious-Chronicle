import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../partials/header";
import Footer from "../partials/footer";
import Notifications from "./Notifications";

import {
  Globe,
  Calendar,
  FileText,
  Heart,
  Eye,
  LayoutDashboard,
  BookText,
  SquarePen,
} from "lucide-react";

import apiInstance from "../../utils/axios";
import Toast from "../../plugin/toast";
import { useAuthStore } from "../../store/auth";

import moment from "moment";

function Profile() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    image: null,
    full_name: "",
    about: "",
    bio: "",
    country: "",
    facebook: "",
    twitter: "",
    post_count: 0,
    date: null,
  });

  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    posts: 0,
  });

  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      try {
        const res = await apiInstance.get("user/profile/");
        const statsRes = await apiInstance.get("author/dashboard/stats/");

        if (!ignore) {
          setProfileData(res.data);
          setImagePreview(res.data.image);

          if (statsRes.data && statsRes.data[0]) {
            setStats(statsRes.data[0]);
          }
        }
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          Toast("error", "Failed to load profile");
        }
      }
    };

    if (isLoggedIn) loadProfile();

    return () => {
      ignore = true;
    };
  }, [isLoggedIn, navigate]);

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileData((prev) => ({
      ...prev,
      image: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      if (profileData.image instanceof File) {
        formData.append("image", profileData.image);
      }

      formData.append("full_name", profileData.full_name?.trim() || "");
      formData.append("about", profileData.about?.trim() || "");
      formData.append("bio", profileData.bio?.trim() || "");
      formData.append("country", profileData.country?.trim() || "");
      formData.append("facebook", profileData.facebook?.trim() || "");
      formData.append("twitter", profileData.twitter?.trim() || "");

      await apiInstance.patch("user/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Toast("success", "Profile updated successfully");
    } catch (err) {
      console.error(err);
      Toast("error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <section className="profile-page-wrapper py-5">
        <div className="container">
          <div className="profile-grid-layout">
            {/* SIDEBAR */}
            <div className="profile-sidebar-column">
              <div className="profile-sidebar-sticky">

                {/* IDENTITY CARD */}
                <div className="profile-card profile-identity-card">
                  <div className="card-body">
                    <div className="profile-avatar-wrapper">
                      <div className="profile-avatar-ring">
                        <img
                          src={
                            imagePreview ||
                            profileData.image ||
                            "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
                          }
                          alt="avatar"
                          className="profile-avatar-image"
                        />
                      </div>

                      <label className="profile-avatar-button">
                        <i className="fas fa-camera"></i>
                        <input
                          type="file"
                          hidden
                          onChange={handleFileChange}
                          name="image"
                        />
                      </label>
                    </div>

                    <h3 className="profile-name">
                      {profileData.full_name ||
                        profileData.user?.full_name ||
                        "User"}
                    </h3>

                    <p className="profile-username">
                      @
                      {profileData.username ||
                        profileData.user?.username ||
                        "username"}
                    </p>

                    <p className="profile-email">
                      {profileData.email || profileData.user?.email || ""}
                    </p>

                    {profileData.bio && (
                      <p className="profile-bio">"{profileData.bio}"</p>
                    )}

                    <div className="profile-divider"></div>

                    <div className="profile-meta">
                      {profileData.country && (
                        <div className="profile-meta-item">
                          <Globe size={16} />
                          <span>{profileData.country}</span>
                        </div>
                      )}

                      {profileData.date && (
                        <div className="profile-meta-item">
                          <Calendar size={16} />
                          <span>
                            Member since{" "}
                            {moment(profileData.date).format("MMMM YYYY")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* STATS CARD */}
                <div className="profile-card profile-stats-card">
                  <div className="card-body">
                    <div className="profile-stats-grid">
                      <div className="profile-stat-item">
                        <div className="profile-stat-icon">
                          <Eye size={18} />
                        </div>
                        <div className="profile-stat-number">{stats.views || 0}</div>
                        <div className="profile-stat-label">Views</div>
                      </div>

                      <div className="profile-stat-item">
                        <div className="profile-stat-icon">
                          <Heart size={18} />
                        </div>
                        <div className="profile-stat-number">{stats.likes || 0}</div>
                        <div className="profile-stat-label">Likes</div>
                      </div>

                      <div className="profile-stat-item">
                        <div className="profile-stat-icon">
                          <FileText size={18} />
                        </div>
                        <div className="profile-stat-number">
                          {profileData.post_count || stats.posts || 0}
                        </div>
                        <div className="profile-stat-label">Posts</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SOCIAL CARD */}
                <div className="profile-card profile-social-card">
                  <div className="card-body">
                    <h5 className="profile-social-title">Social Links</h5>

                    <div className="profile-social-buttons">
                      {profileData.facebook ? (
                        <a
                          href={
                            profileData.facebook.startsWith("http")
                              ? profileData.facebook
                              : `https://${profileData.facebook}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="profile-social-btn"
                        >
                          <i className="fab fa-facebook-f text-primary me-2"></i>
                        </a>
                      ) : (
                        <span className="profile-social-btn disabled">
                          <i className="fab fa-facebook-f"></i>
                        </span>
                      )}

                      {profileData.twitter ? (
                        <a
                          href={
                            profileData.twitter.startsWith("http")
                              ? profileData.twitter
                              : `https://${profileData.twitter}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="profile-social-btn"
                        >
                          <i className="fab fa-twitter text-info me-2"></i>
                        </a>
                      ) : (
                        <span className="profile-social-btn disabled">
                          <i className="fab fa-twitter"></i>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="profile-main-content">
              {/* QUICK ACTIONS */}
              <div className="profile-actions-grid mb-4">
                <Link to="/dashboard" className="profile-action-card">
                  <div className="profile-action-icon">
                    <LayoutDashboard />
                  </div>
                  <div>
                    <h5 className="profile-action-title">Dashboard</h5>
                    <p className="profile-action-subtitle">View your overview</p>
                  </div>
                </Link>

                <Link to="/posts" className="profile-action-card">
                  <div className="profile-action-icon">
                    <BookText />
                  </div>
                  <div>
                    <h5 className="profile-action-title">View All Posts</h5>
                    <p className="profile-action-subtitle">{profileData.post_count || 0} published</p>
                  </div>
                </Link>

                <Link to="/addpost" className="profile-action-card">
                  <div className="profile-action-icon">
                    <SquarePen />
                  </div>
                  <div>
                    <h5 className="profile-action-title">Create New Post</h5>
                    <p className="profile-action-subtitle">Start writing</p>
                  </div>
                </Link>
              </div>

              {/* ABOUT SECTION */}
              <div className="profile-card profile-about-card mb-4">
                <div className="card-body">
                  <h4 className="profile-section-title">About Me</h4>

                  <p className="profile-section-subtitle">
                    A short introduction visible on your public profile.
                  </p>

                  <div className="profile-about-text">
                    {profileData.about ||
                      "Tell readers more about yourself, your journey, interests and work."}
                  </div>
                </div>
              </div>

              {/* PROFILE EDIT */}
              <div className="profile-card profile-edit-card mb-4">
                <div className="card-body">
                  <h4 className="profile-section-title">Edit Profile</h4>

                  <p className="profile-section-subtitle">
                    Update your details. Changes are visible on your public page.
                  </p>

                  <ul className="nav profile-custom-tabs">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                      >
                        Profile
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "about" ? "active" : ""}`}
                        onClick={() => setActiveTab("about")}
                      >
                        About
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "social" ? "active" : ""}`}
                        onClick={() => setActiveTab("social")}
                      >
                        Social Links
                      </button>
                    </li>
                  </ul>

                  {activeTab === "profile" && (
                    <form onSubmit={handleFormSubmit} className="mt-4">
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            name="full_name"
                            value={profileData.full_name || ""}
                            onChange={handleProfileChange}
                            className="form-control profile-form-input"
                            placeholder="Your full name"
                          />
                        </div>

                        <div className="col-md-6 mb-4">
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            value={profileData.username || ""}
                            disabled
                            className="form-control"
                          />
                          <small className="text-muted">
                            Usernames cannot be changed.
                          </small>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Bio</label>
                        <textarea
                          name="bio"
                          value={profileData.bio || ""}
                          onChange={handleProfileChange}
                          className="form-control profile-form-input"
                          rows={4}
                          placeholder="Tell visitors about yourself in a brief bio..."
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={profileData.country || ""}
                          onChange={handleProfileChange}
                          className="form-control profile-form-input"
                          placeholder="e.g., United States, Pakistan, India..."
                        />
                      </div>

                      <div className="text-end">
                        <button
                          type="submit"
                          className="btn btn-primary profile-save-btn"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  )}

                  {activeTab === "about" && (
                    <form onSubmit={handleFormSubmit} className="mt-4">
                      <div className="mb-4">
                        <label className="form-label">About Me</label>
                        <textarea
                          name="about"
                          value={profileData.about || ""}
                          onChange={handleProfileChange}
                          className="form-control profile-form-input"
                          rows={8}
                          placeholder="Write about yourself, your journey, interests, and what inspires you..."
                        />
                      </div>

                      <div className="text-end">
                        <button
                          type="submit"
                          className="btn btn-primary profile-save-btn"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save About"}
                        </button>
                      </div>
                    </form>
                  )}

                  {activeTab === "social" && (
                    <form onSubmit={handleFormSubmit} className="mt-4">
                      <div className="mb-4">
                        <label className="form-label">
                          <i className="fab fa-facebook text-primary me-2"></i>
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          name="facebook"
                          value={profileData.facebook || ""}
                          onChange={handleProfileChange}
                          className="form-control profile-form-input"
                          placeholder="https://facebook.com/yourprofile"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">
                          <i className="fab fa-twitter text-info me-2"></i>
                          Twitter URL
                        </label>
                        <input
                          type="url"
                          name="twitter"
                          value={profileData.twitter || ""}
                          onChange={handleProfileChange}
                          className="form-control profile-form-input"
                          placeholder="https://twitter.com/yourprofile"
                        />
                      </div>

                      <div className="text-end">
                        <button
                          type="submit"
                          className="btn btn-primary profile-save-btn"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save Social Links"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* NOTIFICATIONS */}
              <div className="profile-notification-wrapper">
                <Notifications showAll />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Profile;
