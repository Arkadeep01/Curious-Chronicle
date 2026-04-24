import { useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";

import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";

function CreatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const otp = searchParams.get("otp");
    const uidb64 = searchParams.get("uidb64");
    const reset_token = searchParams.get("reset_token");

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // ✅ VALIDATION
        if (!otp || !uidb64 || !reset_token) {
            Toast("error", "Invalid or expired reset link");
            return;
        }

        if (password !== confirmPassword) {
            Toast("warning", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Toast("warning", "Password must be at least 6 characters");
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("otp", otp);
            formData.append("uidb64", uidb64);
            formData.append("reset_token", reset_token);
            formData.append("password", password);

            await apiInstance.post("user/password-change/", formData);

            Toast("success", "Password changed successfully");

            navigate("/login");
        } catch (error) {
            console.error(error);

            Toast(
                "error",
                error?.response?.data?.message || "Failed to reset password"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />

            <section
                className="container d-flex flex-column vh-100 justify-content-center"
                style={{ marginTop: "100px" }}
            >
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-8">

                        <div className="card shadow-lg border-0">
                            <div className="card-body p-5">

                                <h2 className="fw-bold mb-2">
                                    Create New Password
                                </h2>
                                <p className="text-muted mb-4">
                                    Secure your account with a new password
                                </p>

                                <form onSubmit={handlePasswordSubmit}>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Enter password"
                                            required
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Confirm password"
                                            required
                                            onChange={(e) =>
                                                setConfirmPassword(e.target.value)
                                            }
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`btn w-100 ${
                                            isLoading
                                                ? "btn-secondary"
                                                : "btn-primary"
                                        }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                Processing...
                                                <i className="fas fa-spinner fa-spin ms-2"></i>
                                            </>
                                        ) : (
                                            <>
                                                Save Password
                                                <i className="fas fa-check ms-2"></i>
                                            </>
                                        )}
                                    </button>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default CreatePassword;