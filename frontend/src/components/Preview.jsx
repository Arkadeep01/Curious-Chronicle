import React from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../views/partials/header";
import Footer from "../views/partials/footer";
import moment from "moment";

function Preview() {
  const location = useLocation();
  const { post, imagePreview } = location.state || {};

  if (!post) {
    return (
      <div className="text-center mt-5">
        <h2>No preview data found.</h2>
        <Link to="/addpost/" className="btn btn-primary mt-3">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mt-5 mb-5 preview-paper" style={{ maxWidth: "900px" }}>
        {/* CATEGORY & DATE */}
        <div className="text-center mb-4">
          <span className="badge bg-primary mb-2">
            {post.category || "Uncategorized"}
          </span>
          <h1 className="display-4 fw-bold">{post.title || "Untitled Post"}</h1>
          <p className="text-muted">
            Draft Preview • {moment().format("MMMM Do, YYYY")}
          </p>
        </div>

        {/* FEATURED IMAGE */}
        <div className="mb-5">
          <img
            src={imagePreview || "/images/default.png"}
            alt="Preview"
            className="img-fluid rounded-4 shadow"
            style={{ width: "100%", height: "450px", objectFit: "cover" }}
          />
        </div>

        {/* CONTENT */}
        <div
          className="post-content fancy-text"
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.8",
          }}
          dangerouslySetInnerHTML={{
            __html:
              post.content ||
              post.description ||
              "<p>No content written yet...</p>",
          }}
        ></div>

        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&family=Inter:wght@400;500;600&display=swap');
            
            .preview-paper {
              background: #ffffff;
              padding: 60px 70px;
              border-radius: 12px;
          
              border: 1px solid rgba(0,0,0,0.08);
          
              box-shadow:
                  0 4px 12px rgba(0,0,0,0.04),
                  0 12px 30px rgba(0,0,0,0.06);
          
              min-height: 100vh;
            }

            .fancy-text {
                color: #222;
            }

            .fancy-text h1,
            .fancy-text h2,
            .fancy-text h3 {
                font-family: 'Tangerine', cursive;
                font-size: 64px;
                line-height: 1;
                margin-top: 30px;
                margin-bottom: 12px;
            }

            .fancy-text p,
            .fancy-text li {
                font-family: 'Tangerine', cursive;
                font-size: 42px;
                line-height: 1.15;
                margin-bottom: 10px;
            }

            .fancy-text blockquote {
                font-family: 'Tangerine', cursive;
                font-size: 46px;
                line-height: 1.2;
                border-left: 4px solid #888;
                padding-left: 18px;
                margin: 20px 0;
                font-style: italic;
                position: relative;
            }

            .fancy-text blockquote::before {
                content: "“";
                font-size: 52px;
                position: absolute;
                left: -8px;
                top: -10px;
                color: #888;
            }

            .fancy-text blockquote::after {
                content: "”";
                font-size: 42px;
                position: absolute;
                right: 0;
                bottom: -20px;
                color: #888;
            }
          `}
        </style>

        {/* TAGS */}
        {post.tags && (
          <div className="mt-5 border-top pt-4">
            <h5 className="mb-3">Tags:</h5>
            {post.tags.split(",").map((tag, index) => (
              <span key={index} className="badge border text-dark me-2 p-2">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 text-center bg-light p-4 rounded-3 border">
          <p className="mb-3 text-muted">
            This is a preview. Your post is not yet published.
          </p>
          <Link to="/addpost/" className="btn btn-outline-dark">
            Return to Editor
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Preview;
