import { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";

function Profile() {
    const user = useUserData();
    const userId = user?.user_id;

    const [profileData, setProfileData] = useState({
        image: null,
        full_name: "",
        about: "",
        bio: "",
        facebook: "",
        twitter: "",
        country: "",
    });

    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let ignore = false;

        const loadProfile = async () => {
            try {
                const res = await apiInstance.get(`user/profile/${userId}/`);

                if (!ignore) {
                    setProfileData(res.data);
                    setImagePreview(res.data.image);
                }
            } catch (err) {
                console.error(err);
                Toast("error", "Failed to load profile");
            }
        };

        if (userId) loadProfile();

        return () => {
            ignore = true;
        };
    }, [userId]);


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

            formData.append("full_name", profileData.full_name);
            formData.append("about", profileData.about);
            formData.append("bio", profileData.bio);
            formData.append("facebook", profileData.facebook);
            formData.append("twitter", profileData.twitter);
            formData.append("country", profileData.country);

            await apiInstance.patch(
                `user/profile/${userId}/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

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

            <section className="py-5">
                <div className="container">

                    <div className="card">
                        <div className="card-header">
                            <h3>Profile Settings</h3>
                        </div>

                        <form onSubmit={handleFormSubmit} className="card-body">

                            {/* IMAGE */}
                            <div className="mb-4 d-flex align-items-center gap-3">
                                <img
                                    src={
                                        imagePreview ||
                                        "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
                                    }
                                    alt="avatar"
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />

                                <input
                                    type="file"
                                    name="image"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* FIELDS */}
                            <input
                                name="full_name"
                                value={profileData.full_name}
                                onChange={handleProfileChange}
                                className="form-control mb-3"
                                placeholder="Full Name"
                            />

                            <textarea
                                name="about"
                                value={profileData.about}
                                onChange={handleProfileChange}
                                className="form-control mb-3"
                                rows={4}
                                placeholder="About"
                            />

                            <input
                                name="bio"
                                value={profileData.bio}
                                onChange={handleProfileChange}
                                className="form-control mb-3"
                                placeholder="Bio"
                            />

                            <input
                                name="country"
                                value={profileData.country}
                                onChange={handleProfileChange}
                                className="form-control mb-3"
                                placeholder="Country"
                            />

                            <input
                                name="facebook"
                                value={profileData.facebook}
                                onChange={handleProfileChange}
                                className="form-control mb-3"
                                placeholder="Facebook URL"
                            />

                            <input
                                name="twitter"
                                value={profileData.twitter}
                                onChange={handleProfileChange}
                                className="form-control mb-3"
                                placeholder="Twitter URL"
                            />

                            {/* SUBMIT */}
                            <button
                                className={`btn w-100 ${
                                    loading ? "btn-secondary" : "btn-primary"
                                }`}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                        </form>
                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
}

export default Profile;