import { useState } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/auth";
import { login } from "../../utils/auth";
import Toast from "../../plugin/toast";

function Login() {
    const [bioData, setBioData] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
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

    // ✅ OPTIONAL: auto-redirect if already logged in
    if (isLoggedIn) {
        navigate("/");
    }

    return (
        <>
            <Header />

            <section
                className="container d-flex flex-column justify-content-center vh-100"
                style={{ marginTop: "80px" }}
            >
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-8">

                        <div className="card shadow-lg border-0">
                            <div className="card-body p-5">

                                <h2 className="fw-bold mb-2">
                                    Sign in
                                </h2>
                                <p className="text-muted mb-4">
                                    Welcome back — login to continue
                                </p>

                                <form onSubmit={handleLogin}>

                                    {/* EMAIL */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={bioData.email}
                                            onChange={handleBioDataChange}
                                            className="form-control"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={bioData.password}
                                            onChange={handleBioDataChange}
                                            className="form-control"
                                            placeholder="********"
                                            required
                                        />
                                    </div>

                                    {/* OPTIONS */}
                                    <div className="d-flex justify-content-between mb-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="remember"
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="remember"
                                            >
                                                Remember me
                                            </label>
                                        </div>

                                        <Link to="/forgot-password/">
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* SUBMIT */}
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
                                                Sign In
                                                <i className="fas fa-sign-in-alt ms-2"></i>
                                            </>
                                        )}
                                    </button>

                                </form>

                                <p className="mt-4 text-center">
                                    Don’t have an account?{" "}
                                    <Link to="/register/">
                                        Sign up
                                    </Link>
                                </p>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Login;
