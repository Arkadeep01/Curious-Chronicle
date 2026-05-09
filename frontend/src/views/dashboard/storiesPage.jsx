import { useEffect, useState, useMemo } from "react";
import axios from "axios";

import Header from "../partials/header";
import Footer from "../partials/footer";

import StorySection from "../../components/StorySection";
import Search from "../../components/Search";

function StoriesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/post/lists/")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // TRENDING
  const trendingPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      const scoreA = (a.views || 0) + (a.Likes?.length || 0) * 3;

      const scoreB = (b.views || 0) + (b.Likes?.length || 0) * 3;

      return scoreB - scoreA;
    });
  }, [filteredPosts]);

  // POPULAR
  const popularPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => (b.views || 0) - (a.views || 0));
  }, [filteredPosts]);

  // LATEST
  const latestPosts = useMemo(() => {
    return [...filteredPosts].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  }, [filteredPosts]);

  if (loading) {
    return (
      <>
        <Header />

        <div className="container py-5 text-center">
          <h3>Loading stories...</h3>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="stories-page">
        {/* SEARCH */}
        <div className="container mt-4 search-stories">
          <Search posts={posts} onFilter={setFilteredPosts} />
        </div>

        {/* TRENDING */}
        <StorySection title="Trending Stories" posts={trendingPosts} />

        {/* POPULAR */}
        <StorySection title="Popular Stories" posts={popularPosts} />

        {/* LATEST */}
        <StorySection title="Latest Stories" posts={latestPosts} />

        {/* ALL */}
        <StorySection title="All Stories" posts={posts} />
      </div>

      <Footer />
    </>
  );
}

export default StoriesPage;
