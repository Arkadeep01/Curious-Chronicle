import { useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        // ✅ VALIDATION
        if (!email) {
            Swal.fire({
                icon: "warning",
                text: "Email is required",
            });
            return;
        }

        try {
            setIsLoading(true);

            await apiInstance.get(`user/password-reset/${email}/`);

            setEmail("");

            Swal.fire({
                icon: "success",
                title: "Password Reset Email Sent!",
                text: "Check your email for further instructions.",
            });

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error?.response?.data?.message ||
                    "Something went wrong. Try again.",
            });

        } finally {
            setIsLoading(false);
        }
    };

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
                                    Forgot Password
                                </h2>
                                <p className="text-muted mb-4">
                                    Enter your email to receive reset instructions
                                </p>

                                <form onSubmit={handleEmailSubmit}>

                                    <div className="mb-4">
                                        <label className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
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
                                                Reset Password
                                                <i className="fas fa-arrow-right ms-2"></i>
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

export default ForgotPassword;