import React, { useState } from "react";

const blogPosts = [
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

const categories = ["All Posts", "Advice & Reviews", "Furniture Guide", "Inspiration", "Life Style"];

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState("All Posts");

    return (
        <div className="container-custom">
            {/* Featured Post */}
            <div className="mb-12">
                <div className="flex flex-col items-center gap-15 lg:flex-row">
                    <div className="w-full lg:w-3/4">
                        <img
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
                        <button className="w-fit rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-800">
                            Read More
                        </button>
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
                                activeCategory === cat ? "bg-black text-white" : "bg-white text-gray-600 border"
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
                        <div
                            key={post.id}
                            className="overflow-hidden"
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                className="h-56 w-full rounded-md object-cover"
                            />
                            <div className="pt-6">
                                <span className="text-sm font-bold tracking-wide text-gray-500 uppercase">{post.category}</span>
                                <h3 className="my-2 text-2xl leading-snug font-bold text-gray-900">{post.title}</h3>
                                <div className="mb-3 flex items-center gap-2 text-sm text-gray-500 font-semibold">
                                    <span>{post.date}</span>
                                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                                    <span>{post.author}</span>
                                </div>
                                {post.excerpt && <p className="text-sm leading-relaxed text-gray-600">{post.excerpt}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
