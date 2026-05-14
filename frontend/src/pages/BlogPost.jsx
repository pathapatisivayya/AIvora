import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import api from "../api/client.js";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api
      .get(`/blog/posts/${slug}/`)
      .then((res) => setPost(res.data))
      .catch(() => setPost(null));
  }, [slug]);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-400">
        Loading article…
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Aivora Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
      </Helmet>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/blog" className="text-sm text-sky-300 hover:text-white">
          ← Blog
        </Link>
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <h1 className="font-display text-4xl font-bold text-white">{post.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {post.author_name} · {post.published_at && new Date(post.published_at).toLocaleDateString()}
          </p>
        </motion.header>
        <div className="prose prose-invert mt-10 max-w-none whitespace-pre-wrap text-slate-300">{post.body}</div>
      </article>
    </>
  );
}
