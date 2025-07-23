import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { APIContext } from "@/context/APIContext";

const SearchHeader = ({ id = "categories" }) => {
    const { categories } = useContext(APIContext); // Lấy danh mục từ APIContext
    const navigate = useNavigate();

    const handleCategoryChange = (event) => {
        const selectedCategoryId = event.target.value;
        if (selectedCategoryId) {
            navigate(`/products/${selectedCategoryId}`); // Chuyển hướng đến danh mục được chọn
        }
    };

    return (
        <form className="flex items-center gap-2 rounded-full bg-gray-200">
            <div className="relative flex items-center">
                <select
                    id={id}
                    className="text-md block w-17 appearance-none rounded-full border-2 border-transparent bg-gray-200 px-5 py-3 font-bold text-gray-900 focus:border-black focus:bg-white md:w-40"
                    onChange={handleCategoryChange} // Thêm sự kiện onChange
                >
                    <option value="">All danh mục {/* All categories */}</option>
                    {categories?.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.categoryName}
                        </option>
                    ))}
                </select>

                <svg
                    className="pointer-events-none absolute right-2 w-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16.25 7.5L10 13.75L3.75 7.5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></path>
                </svg>
            </div>

            <div className="flex w-full items-center border-l border-gray-400 pl-2">
                <input
                    type="text"
                    className="w-full bg-transparent outline-none"
                    placeholder="What are you looking for?"
                />
            </div>
        </form>
    );
};

export default SearchHeader;
