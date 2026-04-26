import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../partials/header";
import Footer from "../partials/footer";

function StoriesPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/v1/post/lists/")
      .then((res) => {
  
        const trendingPosts = res.data.sort((a, b) => {
          const scoreA = a.views * 1 + (a.Likes?.length || 0) * 3;
          const scoreB = b.views * 1 + (b.Likes?.length || 0) * 3;
          return scoreB - scoreA;
        });
  
        setPosts(trendingPosts);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>🔥 Trending Stories</h2>

      <div className="row mt-4">
        {posts.map((post) => (
          <div className="col-md-4 mb-4" key={post.id}>
            <div className="card h-100">
              
              {post.image && (
                <img
                  src={post.image}
                  className="card-img-top"
                  alt={post.title}
                />
              )}

              <div className="card-body">
                <h5>{post.title}</h5>
                <p>{post.description?.slice(0, 80)}...</p>
              </div>

              <div className="card-footer d-flex justify-content-between">
                <small>👁 {post.views}</small>
                <small>❤️ {post.Likes.length}</small>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoriesPage;