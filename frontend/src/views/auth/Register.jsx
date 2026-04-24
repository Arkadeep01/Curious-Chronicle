import { useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/auth";
import { register } from "../../utils/auth";
import Toast from "../../plugin/Toast";

function Register() {
    const [bioData, setBioData] = useState({
        full_name: "",
        email: "",
        password: "",
        password2: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

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

        // ✅ VALIDATION
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

        try {
            setIsLoading(true);

            const { error } = await register(
                bioData.full_name,
                bioData.email,
                bioData.password,
                bioData.password2
            );

            if (error) {
                Toast(
                    "error",
                    error?.message || "Registration failed"
                );
                resetForm();
                return;
            }

            Toast("success", "Account created successfully");

            navigate("/login/");

        } catch (err) {
            console.error(err);
            Toast("error", "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ AUTO REDIRECT IF LOGGED IN
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
                                    Sign up
                                </h2>
                                <p className="text-muted mb-4">
                                    Create your account to start writing
                                </p>

                                <form onSubmit={handleRegister}>

                                    {/* NAME */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={bioData.full_name}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>

                                    {/* EMAIL */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={bioData.email}
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="********"
                                            required
                                        />
                                    </div>

                                    {/* CONFIRM */}
                                    <div className="mb-4">
                                        <label className="form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password2"
                                            value={bioData.password2}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="********"
                                            required
                                        />
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
                                                Sign Up
                                                <i className="fas fa-user-plus ms-2"></i>
                                            </>
                                        )}
                                    </button>

                                </form>

                                <p className="mt-4 text-center">
                                    Already have an account?{" "}
                                    <Link to="/login/">
                                        Sign In
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

export default Register;