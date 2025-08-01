import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getNewsById, getNews } from "../api/service/BlogService";
import BlogImage from "../components/ui/BlogImage";

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogPost, setBlogPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm format date từ API response
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            return "Unknown Date";
        }
    };

    // Hàm chuyển đổi dữ liệu từ API
    const transformNewsData = (news) => {
        return {
            id: news.id,
            image: news.newsAvatar || "/img/FeatureSection/multicolumn-1.png",
            category: "INSPIRATION",
            title: news.title || "Untitled",
            date: formatDate(news.createdDate),
            author: news.userName || news.createdBy || "Unknown Author",
            content: news.content || "",
            excerpt: news.content ? news.content.replace(/<[^>]*>/g, "").substring(0, 150) + "..." : "",
            isActive: news.isActive,
        };
    };

    // Fetch chi tiết bài viết và bài viết liên quan
    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setLoading(true);

                // Fetch chi tiết bài viết
                const response = await getNewsById(id);

                if (response && !response.error) {
                    const transformedPost = transformNewsData(response);
                    setBlogPost(transformedPost);

                    // Fetch tất cả bài viết để lấy related posts
                    const allPostsResponse = await getNews();
                    if (allPostsResponse && allPostsResponse.length > 0) {
                        const otherPosts = allPostsResponse
                            .filter((post) => post.id !== parseInt(id) && post.isActive)
                            .sort(() => Math.random() - 0.5) // Random sort
                            .slice(0, 3) // Lấy 3 bài liên quan
                            .map(transformNewsData);

                        setRelatedPosts(otherPosts);
                    }
                } else {
                    setError("Blog post not found");
                }
            } catch (error) {
                console.error("Error fetching blog detail:", error);
                setError("Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogDetail();
        }
    }, [id]);

    // Hiển thị loading state
    if (loading) {
        return (
            <div className="container-custom">
                <div className="flex h-64 items-center justify-center">
                    <div className="text-lg text-gray-600">Loading blog post...</div>
                </div>
            </div>
        );
    }

    // Hiển thị error state
    if (error || !blogPost) {
        return (
            <div className="container-custom">
                <div className="py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900">Blog Post Not Found</h1>
                    <p className="mb-8 text-gray-600">The blog post you're looking for doesn't exist or has been removed.</p>
                    <Link
                        to="/blog"
                        className="inline-block rounded-full bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
                    >
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom">
            {/* Article Header */}
            <div className="mb-8 text-center">
                <span className="mb-4 inline-block text-xs font-semibold tracking-wide text-gray-500 uppercase">{blogPost.category}</span>
                <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">{blogPost.title}</h1>
                <div className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span>{blogPost.date}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    <span className="font-semibold">{blogPost.author}</span>
                </div>
            </div>

            {/* Featured Image */}
            <div className="mb-12">
                <BlogImage
                    src={blogPost.image}
                    alt={blogPost.title}
                    className="mx-auto h-96 rounded-lg object-cover shadow-lg md:h-[500px]"
                />
            </div>

            {/* Article Content */}
            <div className="mx-auto max-w-4xl">
                <div className="prose prose-lg mb-12 max-w-none">
                    {/* Nếu content có HTML, render nó */}
                    {blogPost.content ? (
                        <div
                            className="leading-relaxed text-gray-700"
                            dangerouslySetInnerHTML={{ __html: blogPost.content }}
                        />
                    ) : (
                        <p className="leading-relaxed text-gray-700">No content available for this blog post.</p>
                    )}
                </div>

                {/* Tags and Share */}
                <div className="mb-12 border-t border-gray-200 pt-8">
                    <div className="flex flex-col justify-between md:flex-row md:items-center">
                        <div className="mb-4 md:mb-0">
                            <span className="mr-3 text-sm font-semibold text-gray-900">Tags:</span>
                            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">Inspiration</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-3 text-sm font-semibold text-gray-900">Share:</span>
                            <div className="flex gap-2">
                                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700">
                                    <i className="fab fa-facebook-f text-xs"></i>
                                </button>
                                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white transition-colors hover:bg-gray-900">
                                    <i className="fab fa-twitter text-xs"></i>
                                </button>
                                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700">
                                    <i className="fab fa-pinterest text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mb-12 border-t border-gray-200 pt-8">
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div className="w-full md:w-1/2">
                            <span className="mb-2 block text-sm text-gray-500">← Previous Post</span>
                            <Link
                                to={`/blog/${relatedPosts[0]?.id || "#"}`}
                                className="text-lg font-semibold text-gray-900 transition-colors hover:text-gray-700"
                            >
                                {relatedPosts[0]?.title || "No previous post"}
                            </Link>
                        </div>
                        <div className="w-full text-left md:w-1/2 md:text-right">
                            <span className="mb-2 block text-sm text-gray-500">Next Post →</span>
                            <Link
                                to={`/blog/${relatedPosts[1]?.id || "#"}`}
                                className="text-lg font-semibold text-gray-900 transition-colors hover:text-gray-700"
                            >
                                {relatedPosts[1]?.title || "No next post"}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div className="border-t border-gray-200 pt-12">
                    <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Related Posts</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {relatedPosts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.id}`}
                                className="group block overflow-hidden"
                            >
                                <BlogImage
                                    src={post.image}
                                    alt={post.title}
                                    className="h-48 w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="pt-4">
                                    <span className="text-xs font-bold tracking-wide text-gray-500 uppercase">{post.category}</span>
                                    <h3 className="my-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-gray-700">{post.title}</h3>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                        <span>{post.date}</span>
                                        <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                                        <span>{post.author}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Back to Blog Button */}
            <div className="mt-12 pb-12 text-center">
                <Link
                    to="/blog"
                    className="inline-block rounded-full bg-black px-8 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
                >
                    Back to All Posts
                </Link>
            </div>
        </div>
    );
}
