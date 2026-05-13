import { useState } from "react";
import Header from "../partials/header";
import { useNavigate, useSearchParams } from "react-router-dom";

import apiInstance from "../../utils/axios";
import Toast from "../../plugin/toast";

function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const otp = searchParams.get("otp");
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!otp || !uid || !token) {
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

      await apiInstance.post("user/password-change/", {
        otp,
        uid,
        token,
        password,
      });

      Toast("success", "Password updated successfully");

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      const errorData = error?.response?.data;

      let message =
        errorData?.message ||
        errorData?.detail ||
        Object.values(errorData || {})?.flat()?.[0] ||
        "Failed to reset password";

      Toast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="auth-wrapper create-page">
        <div className="auth-card">
          <div className="create-bg">
            <img src="/images/create_password.jpg" alt="Create Password" />
          </div>

          <div className="create-text">
            <h2>
              Set your new password
              <br />
              Stay protected.
            </h2>
            <p>Choose a strong password to secure your account.</p>
          </div>

          <div className="create-form">
            <h2>Create Password</h2>
            <p className="auth-subtext">Enter and confirm your new password</p>

            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="New password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <small className="password-hint">
                Use uppercase, number & special character
              </small>

              <button disabled={isLoading}>
                {isLoading ? "Saving..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePassword;
