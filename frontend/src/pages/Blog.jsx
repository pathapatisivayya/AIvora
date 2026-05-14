import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import api from "../api/client.js";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get("/blog/posts/")
      .then((res) => setPosts(res.data?.results ?? res.data ?? []))
      .catch(() =>
        setPosts([
          {
            id: 1,
            title: "Shipping AI features without breaking trust",
            slug: "shipping-ai-features",
            excerpt: "Patterns for observability, evaluation, and human-in-the-loop releases.",
            published_at: new Date().toISOString(),
          },
        ]),
      );
  }, []);

  const list = Array.isArray(posts) ? posts : posts.results || [];

  return (
    <>
      <Helmet>
        <title>Blog | Aivora Solutions</title>
        <meta name="description" content="Insights on AI delivery, Django & React architecture, and enterprise software." />
      </Helmet>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-white">Blog</h1>
        <p className="mt-4 text-lg text-slate-400">Notes from the build floor — architecture, AI, and delivery craft.</p>
        <div className="mt-10 space-y-6">
          {list.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-6"
            >
              <Link to={`/blog/${post.slug}`} className="font-display text-xl font-semibold text-white hover:text-sky-300">
                {post.title}
              </Link>
              {post.excerpt && <p className="mt-2 text-slate-400">{post.excerpt}</p>}
              {post.published_at && (
                <p className="mt-3 text-xs text-slate-500">{new Date(post.published_at).toLocaleDateString()}</p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </>
  );
}
