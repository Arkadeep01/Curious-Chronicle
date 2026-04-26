import { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Index from "./views/core/index";
import Detail from "./views/core/Details";
import Search from "./views/core/Search";
import Category from "./views/core/Category";
import About from "./views/pages/About";
import Contact from "./views/pages/Contact";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";
import Dashboard from "./views/dashboard/Dashboard";
import Posts from "./views/dashboard/Posts";
import AddPost from "./views/dashboard/AddPost";
import EditPost from "./views/dashboard/EditPost";
import Comments from "./views/dashboard/Comments";
import Notifications from "./views/dashboard/Notifications";
import Profile from "./views/dashboard/Profile";
import StoriesPage from "./views/dashboard/storiesPage";
import Press from "./views/pages/Press";

import MainWrapper from "../src/layouts/MainWrapper";
import "./index.css";

function App() {

  useEffect(() => {
    const dot = document.querySelector(".cursor-nib");
    const ring = document.querySelector(".cursor-ring");

    const moveCursor = (e) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";

      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    };

    const hover = () => {ring.classList.add("cursor-hover");};
    const unhover = () => {ring.classList.remove("cursor-hover");};

    document.querySelectorAll("a, button, .logo").forEach((el) => {
      el.addEventListener("mouseenter", hover);
      el.addEventListener("mouseleave", unhover);
    });

    window.addEventListener("mousemove", moveCursor);

    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div className="cursor-nib">
        <svg viewBox="0 0 24 24" className="nib-svg">
          <path d="M12 2L19 21L12 17L5 21L12 2Z" />
          <circle cx="12" cy="13" r="1.5" fill="#fff"/>
        </svg>
      </div>
      <div className="cursor-ring"></div>
      <BrowserRouter>
        <MainWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:slug/" element={<Detail />} />
            <Route path="/category/:slug/" element={<Category />} />
            <Route path="/search/" element={<Search />} />

            {/* Authentication */}
            <Route path="/register/" element={<Register />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/logout/" element={<Logout />} />
            <Route path="/forgot-password/" element={<ForgotPassword />} />
            <Route path="/create-password/" element={<CreatePassword />} />

            {/* Dashboard */}
            <Route path="/dashboard/" element={<Dashboard />} />
            <Route path="/posts/" element={<Posts />} />
            <Route path="/add-post/" element={<AddPost />} />
            <Route path="/edit-post/:id/" element={<EditPost />} />
            <Route path="/comments/" element={<Comments />} />
            <Route path="/notifications/" element={<Notifications />} />
            <Route path="/profile/" element={<Profile />} />
            <Route path="/stories" element={<StoriesPage />} />

            {/* Pages */}
            <Route path="/about/" element={<About />} />
            <Route path="/contact/" element={<Contact />} />
            <Route path="/Press" element={<Press />} />
            
          </Routes>
        </MainWrapper>
      </BrowserRouter>
    </>
  );
}

export default App;
