import React, { useState, useEffect } from "react";
import { Card, FormField, Loader } from "../components";

/* ---------------- RenderCards ---------------- */
const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <div className="glass p-6 rounded-xl text-center animate-in">
      <h2 className="font-semibold text-lg tracking-wide">
        {title}
      </h2>
      <p className="mt-1 text-sm opacity-80">
        Try changing your search or create a new post.
      </p>
    </div>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/post", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    clearTimeout(searchTimeout);
    setSearchText(value);

    setSearchTimeout(
      setTimeout(() => {
        if (!allPosts) return;
        const q = value.toLowerCase();
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.prompt.toLowerCase().includes(q)
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const showing = searchText ? searchedResults?.length || 0 : allPosts?.length || 0;

  return (
    <section className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center animate-in">
        <h1
          className="
            text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight
            bg-clip-text text-transparent
            bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-strong))]
          "
        >
          Divine Studio — Text-to-Image AI Generator
        </h1>
        <p className="mt-3 text-base md:text-lg opacity-80">
          Turn prompts into stunning visuals. Explore community creations or hit
          <span className="mx-1 px-2 py-0.5 rounded-md border border-white/20 bg-white/5">
            Create
          </span>
          to make your own.
        </p>
      </div>

      {/* Search */}
      <div className="mt-10 glass p-4 md:p-5 rounded-2xl animate-in">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <FormField
              labelName="Search Posts"
              type="text"
              name="text"
              placeholder="Search by author or prompt…"
              value={searchText}
              handleChange={handleSearchChange}
              className="input"
            />
          </div>

          {searchText && (
            <button
              className="btn"
              onClick={() => {
                setSearchText("");
                setSearchedResults(allPosts || []);
              }}
              title="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 text-sm opacity-70">
          {loading ? "Loading…" : `Showing ${showing} post${showing === 1 ? "" : "s"}`}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-lg mb-3 opacity-80 animate-in">
                Results for <span className="font-semibold">{searchText}</span>
              </h2>
            )}

            <div
              className="
                grid gap-4 sm:gap-5 
                lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1
              "
            >
              {searchText ? (
                <RenderCards data={searchedResults} title="No Search Results Found" />
              ) : (
                <RenderCards data={allPosts} title="No Posts Yet" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
