import { useEffect, useMemo, useState } from "react";

function Search({ posts = [], onFilter }) {
  const [query, setQuery] = useState("");

  const cleanText = (html = "") => {
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const filteredPosts = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return posts;
    }

    return posts.filter((post) => {
      const title = post.title?.toLowerCase() || "";

      const author = post.profile?.full_name?.toLowerCase() || "";

      const category = post.category?.title?.toLowerCase() || "";

      const description = cleanText(post.description)?.toLowerCase() || "";

      return (
        title.includes(value) ||
        author.includes(value) ||
        category.includes(value) ||
        description.includes(value)
      );
    });
  }, [posts, query]);

  useEffect(() => {
    if (onFilter) {
      onFilter(filteredPosts);
    }
  }, [filteredPosts, onFilter]);

  return (
    <div className="stories-search-container">
      <div className="stories-search-wrapper">
        <div className="stories-search-icon">
          <i className="fas fa-search"></i>
        </div>

        <input
          type="search"
          placeholder="Search blogs..."
          className="stories-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button type="button" className="stories-search-btn">
          Search
        </button>
      </div>
    </div>
  );
}

export default Search;
