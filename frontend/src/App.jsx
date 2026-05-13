import { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Index from "./views/core/index";
import Detail from "./views/core/Details";
import Category from "./views/core/Category";
import AuthorProfile from "./views/core/AuthorProfile";
import About from "./views/pages/About";
import Contact from "./views/pages/Contact";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";
import Dashboard from "./views/dashboard/Dashboard";
import Posts from "./views/dashboard/Posts";
import AddPost from "./views/dashboard/AddPost";
import EditPost from "./views/dashboard/EditPost";
import Profile from "./views/dashboard/Profile";
import StoriesPage from "./views/dashboard/storiesPage";
import Press from "./views/pages/Press";
import NotFound from "./errors/NotFound";
import Preview from "./components/Preview";

import MainWrapper from "./layouts/MainWrapper";
import PrivateRoute from "./layouts/PrivateRoute";
import PublicRoute from "./layouts/PublicRoute";
import "./index.css";
import "./App.css";

function App() {
  useEffect(() => {
    const dot = document.querySelector(".cursor-nib");
    const ring = document.querySelector(".cursor-ring");

    if (!dot || !ring) return;

    const moveCursor = (e) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    };

    const hover = () => ring.classList.add("cursor-hover");
    const unhover = () => ring.classList.remove("cursor-hover");

    const attachListeners = () => {
      document.querySelectorAll("a, button, .logo").forEach((el) => {
        el.addEventListener("mouseenter", hover);
        el.addEventListener("mouseleave", unhover);
      });
    };

    const mutationObserver = new MutationObserver(attachListeners);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", moveCursor);
    attachListeners();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      mutationObserver.disconnect();
    };
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
            <Route path="/post/:blog/" element={<Detail />} />
            <Route path="/category/:blog/" element={<Category />} />
            <Route path="/category/" element={<Category />} />
            <Route path="/preview/" element={<Preview />} />
            <Route path="/about/" element={<About />} />
            <Route path="/contact/" element={<Contact />} />
            <Route path="/press" element={<Press />} />
            <Route path="/register/" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/login/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/forgot-password/" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/create-password" element={<PublicRoute><CreatePassword /></PublicRoute>} />
            <Route path="/dashboard/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/author/:id/" element={<AuthorProfile />}/>
            <Route path="/posts/" element={<PrivateRoute><Posts /></PrivateRoute>} />
            <Route path="/addpost/" element={<PrivateRoute><AddPost /></PrivateRoute>} />
            <Route path="/edit-post/:id/" element={<PrivateRoute><EditPost /></PrivateRoute>} />
            <Route path="/profile/" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/stories" element={<PrivateRoute><StoriesPage /></PrivateRoute>} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainWrapper>
      </BrowserRouter>
    </>
  );
}

export default App;
