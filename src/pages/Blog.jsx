import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../api/service/BlogService";
import { createImageDataUrl } from "../utils/base64Utils";
import BlogImage from "../components/ui/BlogImage";

// Fallback data nếu API không có dữ liệu
const fallbackBlogPosts = [
    {
        id: 1,
        image: "/img/FeatureSection/multicolumn-1.png",
        category: "INSPIRATION",
        title: "Long Read: Eco System Design Principles",
        date: "Dec 24, 2024",
        author: "FOXECOM",
        excerpt: "When it comes to creating sustainable ecosystems, there are key design principles that must be considered. These principles...",
    },
    {
        id: 2,
        image: "/img/FeatureSection/multicolumn-2.png",
        category: "INSPIRATION",
        title: "Meet our designers: Lysemose & de Gier",
        date: "Dec 2, 2024",
        author: "FOXECOM",
        excerpt: "",
    },
    {
        id: 3,
        image: "/img/FeatureSection/multicolumn-3.png",
        category: "INSPIRATION",
        title: "Our Creative Director's Date",
        date: "Nov 25, 2024",
        author: "FOXECOM",
        excerpt: "",
    },
    {
        id: 4,
        image: "/img/FeatureSection/multicolumn-4.png",
        category: "INSPIRATION",
        title: "Through the eyes of the designer",
        date: "Nov 16, 2024",
        author: "FOXECOM",
        excerpt: "",
    },
];

const categories = ["Tất cả bài viết", "Lời khuyên & Đánh giá", "Hướng dẫn nội thất", "Cảm hứng", "Phong cách sống"];

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState("Tất cả bài viết");
    const [blogPosts, setBlogPosts] = useState(fallbackBlogPosts);
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

    // Hàm chuyển đổi dữ liệu từ API thành format component
    const transformNewsData = (newsArray) => {
        return newsArray.map((news) => ({
            id: news.id,
            image: news.newsAvatar || "/img/FeatureSection/multicolumn-1.png",
            category: "INSPIRATION", // Mặc định vì API không có category
            title: news.title || "Untitled",
            date: formatDate(news.createdDate),
            author: news.userName || news.createdBy || "Unknown Author",
            excerpt: news.content
                ? // Loại bỏ HTML tags để lấy text thuần
                  news.content.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
                : "",
            isActive: news.isActive,
        }));
    };

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                setLoading(true);
                const response = await getNews();

                if (response && response.length > 0) {
                    // Sắp xếp theo ngày tạo mới nhất
                    const sortedNews = response.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

                    // Chỉ lấy những bài active
                    const activeNews = sortedNews.filter((news) => news.isActive);

                    if (activeNews.length > 0) {
                        const transformedData = transformNewsData(activeNews);
                        setBlogPosts(transformedData);
                    } else {
                        // Nếu không có bài nào active, dùng fallback
                        setBlogPosts(fallbackBlogPosts);
                    }
                } else {
                    // Nếu API trả về rỗng, dùng fallback
                    setBlogPosts(fallbackBlogPosts);
                }
            } catch (error) {
                console.error("Error fetching blog posts:", error);
                setError("Failed to load blog posts");
                setBlogPosts(fallbackBlogPosts);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    // Hiển thị loading state
    if (loading) {
        return (
            <div className="container-custom">
                <div className="flex h-64 items-center justify-center">
                    <div className="text-lg text-gray-600">Loading blog posts...</div>
                </div>
            </div>
        );
    }

    // Hiển thị error state (nhưng vẫn show fallback data)
    if (error) {
        console.warn(error);
    }

    return (
        <div className="container-custom">
            {/* Error notification */}
            {error && (
                <div className="mb-4 rounded border border-yellow-400 bg-yellow-100 p-4 text-yellow-700">
                    <p className="text-sm">⚠️ Unable to load latest blog posts. Showing sample content.</p>
                </div>
            )}

            {/* Featured Post */}
            <div className="mb-12">
                <div className="flex flex-col items-center gap-15 lg:flex-row">
                    <div className="w-full lg:w-3/4">
                        <BlogImage
                            src={blogPosts[0].image}
                            alt={blogPosts[0].title}
                            className="h-80 w-full rounded-md object-cover shadow-sm lg:h-[400px]"
                        />
                    </div>
                    <div className="flex w-full flex-col justify-center lg:w-1/2">
                        <span className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">{blogPosts[0].category}</span>
                        <h1 className="mb-4 text-3xl leading-tight font-bold text-gray-900 lg:text-4xl">{blogPosts[0].title}</h1>
                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                            <span>{blogPosts[0].date}</span>
                            <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                            <span>{blogPosts[0].author}</span>
                        </div>
                        <p className="mb-8 leading-relaxed text-gray-600">{blogPosts[0].excerpt}</p>
                        <Link
                            to={`/blog/${blogPosts[0].id}`}
                            className="inline-block w-fit rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-800"
                        >
                            Read More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Blog Title */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Inspirations</h2>
            </div>

            {/* Filter Buttons */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-full px-6 py-2 font-medium transition-colors duration-200 ${
                                activeCategory === cat ? "bg-black text-white" : "border bg-white text-gray-600"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Blog Grid */}
            <div className="pb-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogPosts.slice(1).map((post) => (
                        <Link
                            key={post.id}
                            to={`/blog/${post.id}`}
                            className="group block overflow-hidden"
                        >
                            <BlogImage
                                src={post.image}
                                alt={post.title}
                                className="h-56 w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="pt-6">
                                <span className="text-sm font-bold tracking-wide text-gray-500 uppercase">{post.category}</span>
                                <h3 className="my-2 text-2xl leading-snug font-bold text-gray-900 transition-colors group-hover:text-gray-700">
                                    {post.title}
                                </h3>
                                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
                                    <span>{post.date}</span>
                                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                                    <span>{post.author}</span>
                                </div>
                                {post.excerpt && <p className="text-sm leading-relaxed text-gray-600">{post.excerpt}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
