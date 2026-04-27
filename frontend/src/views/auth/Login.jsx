import { useState } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../utils/auth";
import Toast from "../../plugin/toast";

function Login() {
    const [bioData, setBioData] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleBioDataChange = (e) => {
        setBioData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const resetForm = () => {
        setBioData({ email: "", password: "" });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!bioData.email || !bioData.password) {
            Toast("warning", "Email and password are required");
            return;
        }

        try {
            setIsLoading(true);

            const { error } = await login(
                bioData.email,
                bioData.password
            );

            if (error) {
                Toast(
                    "error",
                    error?.message || "Invalid credentials"
                );
                resetForm();
                return;
            }

            Toast("success", "Login successful");

            navigate("/");

        } catch (err) {
            console.error(err);

            Toast("error", "Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
          <Header />
      
          <div className="login-wrapper">
            <div className="login-container">
      
              {/* LEFT SIDE */}
              <div className="login-left">
                <h1>Welcome!</h1>
                <p>
                  Login to continue your journey and explore amazing content.
                </p>
                <button className="learn-btn">Learn More</button>
              </div>
      
              {/* RIGHT SIDE */}
              <div className="login-right">
                <h2>Sign in</h2>
      
                <form onSubmit={handleLogin}>
      
                  <input
                    type="email"
                    name="email"
                    value={bioData.email}
                    onChange={handleBioDataChange}
                    placeholder="Email"
                    required
                  />
      
                  <input
                    type="password"
                    name="password"
                    value={bioData.password}
                    onChange={handleBioDataChange}
                    placeholder="Password"
                    required
                  />
      
                  <button className="login-btn" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Submit"}
                  </button>
      
                </form>
      
                <div className="extra-links">
                  <Link to="/forgot-password/">Forgot password?</Link>
                  <Link to="/register/">Create account</Link>
                </div>
      
              </div>
      
            </div>
          </div>
        </>
      );
}

export default Login;
