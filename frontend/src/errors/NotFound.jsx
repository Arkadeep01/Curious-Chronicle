import { Link } from "react-router-dom";
import Header from "../views/partials/header";

function NotFound() {
  return (
  <>
    <Header />
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100%"
    }}>

      {/* LEFT */}
      <div style={{ width: "50%" }}>
        <img
          src="./images/error.png"
          alt="404"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* RIGHT */}
      <div style={{
        width: "50%",
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px"
      }}>

        <h1 style={{
          position: "absolute",
          fontSize: "420px",
          color: "rgba(255, 255, 255, 0.19)"
        }}>
          404
        </h1>

        <h1 className="logo text-center">Page not found</h1>

        <p className="text-center" style={{ color: "#aaa" }}>
          The page you’re looking for doesn’t exist.
        </p>

        <Link to="/" 
          className="align-items-center" 
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px auto",
            background: "white",
            color: "black",
            padding: "10px 20px",
            borderRadius: "30px",
            textDecoration: "none",
            width: "fit-content"
          }}
        >
          Go back home →
        </Link>

      </div>

    </div>
  </>
  );
}

export default NotFound;