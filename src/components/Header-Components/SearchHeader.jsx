import React from "react";

const SearchHeader = ({ id = "categories" }) => {
    return (
        <form className="flex items-center gap-2 rounded-full bg-gray-200">
            <div className="relative flex items-center">
                <select
                    id={id}
                    className="text-md block w-17 appearance-none rounded-full border-2 border-transparent bg-gray-200 px-5 py-3 font-bold text-gray-900 focus:border-black focus:bg-white md:w-40"
                >
                    <option value=""> All categories </option>
                    <option value=""> United States </option>
                    <option value=""> Canada </option>
                    <option value=""> France </option>
                    <option value=""> Germany </option>
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
