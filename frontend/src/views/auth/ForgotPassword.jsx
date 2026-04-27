import { useState } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";

import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "warning",
        text: "Email is required",
      });
      return;
    }

    try {
      setIsLoading(true);

      Swal.fire({
        title: "Sending email...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await apiInstance.post("user/password-reset/", { email });

      Swal.close();

      setEmail("");

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "Check your email and click the reset link.",
      });
    } catch (error) {
      Swal.close();

      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* BACKGROUND IMAGE */}
          <div className="auth-bg">
            <img src="/images/forgot_password.png" alt="bg" />
          </div>

          {/* LEFT TEXT */}
          <div className="auth-left-text">
              <h2>
                Forgot your password?
                <br />
                No worries.
              </h2>
              <p>We’ll send you a reset link instantly.</p>
            </div>

          {/* RIGHT FORM */}
          <div className="auth-form-box">
            <h2>Reset Password</h2>
            <p className="auth-subtext">
              Enter your email to receive instructions
            </p>

            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}

export default ForgotPassword;
