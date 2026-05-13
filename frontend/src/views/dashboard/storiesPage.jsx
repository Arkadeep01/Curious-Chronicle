import { useState, useEffect } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import StorySection from "../../components/storySection";
import Search from "../../components/Search";
import apiInstance from "../../utils/axios";

function StoriesPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const res = await apiInstance.get("post/lists/");
        const data = res.data?.results || res.data || [];
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const trendingPosts = [...filteredPosts].sort((a, b) => {
    const scoreA = (a.views || 0) + (a.Likes?.length || 0) * 3;
    const scoreB = (b.views || 0) + (b.Likes?.length || 0) * 3;
    return scoreB - scoreA;
  });

  const popularPosts = [...filteredPosts].sort((a, b) => (b.views || 0) - (a.views || 0));
  const latestPosts = [...filteredPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading stories...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <p className="text-danger">Failed to load stories: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="container pt-4">
          <Search posts={posts} onFilter={setFilteredPosts} />
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="container py-5 text-center">
            <p>No stories found</p>
          </div>
        ) : (
          <>
            <StorySection title="Trending Stories" posts={trendingPosts} />
            <StorySection title="Popular Stories" posts={popularPosts} />
            <StorySection title="Latest Stories" posts={latestPosts} />
            <StorySection title="All Stories" posts={filteredPosts} />
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default StoriesPage;