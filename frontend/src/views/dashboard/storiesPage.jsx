import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Header from "../partials/header";
import Footer from "../partials/footer";
import TrendingSection from "../../components/TrendingSection";

function StoriesPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/v1/post/lists/")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const trendingPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const scoreA = (a.views || 0) + (a.Likes?.length || 0) * 3;
      const scoreB = (b.views || 0) + (b.Likes?.length || 0) * 3;
      return scoreB - scoreA;
    });
  }, [posts]);

  const latestPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [posts]);

  return (
    <>
      <Header />

      <div className="container mt-4">

        <section id="trending-section">
          <TrendingSection posts={trendingPosts} showHeader={true} />
        </section>

        <section className="mt-5">
          <h2>Latest Stories </h2>
          <div className="row mt-3">
            {latestPosts.slice(0, 6).map((post) => (
              <div className="col-md-4 mb-4" key={post.id}>
                <div className="card h-100">
                  <img src={post.image} className="card-img-top" alt="" />
                  <div className="card-body">
                    <h5>{post.title}</h5>
                    <p>{post.description?.slice(0, 80)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 📚 ALL STORIES */}
        <section className="mt-5 mb-5">
          <h2>All Stories </h2>
          <div className="row mt-3">
            {posts.map((post) => (
              <div className="col-md-3 mb-4" key={post.id}>
                <div className="card h-100">
                  <img src={post.image} className="card-img-top" alt="" />
                  <div className="card-body">
                    <h6>{post.title?.slice(0, 40)}...</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}

export default StoriesPage;