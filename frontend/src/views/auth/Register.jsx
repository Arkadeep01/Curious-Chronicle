import { useState } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link } from "react-router-dom";
import { register } from "../../utils/auth";
import Toast from "../../plugin/toast";
import {  Apple } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

function Register() {
  const [agree, setAgree] = useState(false);
  const [bioData, setBioData] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setBioData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setBioData({
      full_name: "",
      email: "",
      password: "",
      password2: "",
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!bioData.full_name || !bioData.email || !bioData.password) {
      Toast("warning", "All fields are required");
      return;
    }

    if (bioData.password !== bioData.password2) {
      Toast("warning", "Passwords do not match");
      return;
    }

    if (bioData.password.length < 6) {
      Toast("warning", "Password must be at least 6 characters");
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!specialCharRegex.test(bioData.password)) {
      Toast("warning", "Password must contain at least one special character");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await register(
        bioData.full_name,
        bioData.email,
        bioData.password,
        bioData.password2,
      );

      if (error) {
        const errorData = error;

        let message =
          errorData?.password?.[0] ||
          errorData?.email?.[0] ||
          errorData?.full_name?.[0] ||
          errorData?.non_field_errors?.[0] ||
          Object.values(errorData || {})?.flat()?.[0] ||
          "Registration failed";

        Toast("error", message);
        resetForm();
        return;
      }

      Toast("success", "Account created successfully");

      setTimeout(() => {
        window.location.href = "/login/";
      }, 1000);
    } catch (err) {
      console.error(err);
      Toast("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="register-wrapper">
        <div className="register-card">
          {/* LEFT SIDE (IMAGE PANEL) */}
          <div className="register-left">
            <img src="/images/signup.png" alt="Signup Illustration" />
            <div className="overlay">
              <h2>
                Capturing Moments,
                <br />
                Creating Memories
              </h2>
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className="register-right">
            <h2>Create an account</h2>
            <p className="login-link">
              Already have an account? <Link to="/login/">Log in</Link>
            </p>

            <form onSubmit={handleRegister}>
              {/* NAME ROW */}
              <div className="row-input">
                <input
                  type="text"
                  name="full_name"
                  value={bioData.full_name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />
              </div>

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                value={bioData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />

              {/* PASSWORD */}
              <input
                type="password"
                name="password"
                value={bioData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

              {/* CONFIRM */}
              <input
                type="password"
                name="password2"
                value={bioData.password2}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />

              {/* TERMS */}
              <label className="terms">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>I agree to the Terms & Conditions</span>
              </label>

              {/* BUTTON */}
              <button disabled={isLoading} className="register-btn">
                {isLoading ? "Processing..." : "Create account"}
              </button>
            </form>

            {/* SOCIAL */}
            <div className="divider">Or register with</div>

            <div className="social-buttons">
              <button className="google">
                <FcGoogle size={18} /> Google
              </button>
              <button className="apple">
                <Apple size={18} /> Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
