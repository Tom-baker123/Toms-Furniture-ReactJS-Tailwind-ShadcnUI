import React from "react";
import CategoryTestComponent from "@/components/Header-Components/Nav-Item-Details/CategoryTestComponent";
import MegaMenuPreview from "@/components/Header-Components/Nav-Item-Details/MegaMenuPreview";
import CategoryFilterDebug from "@/components/Header-Components/Nav-Item-Details/CategoryFilterDebug";

const CategoryDebugPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8">
                <h1 className="mb-8 text-center text-3xl font-bold">Category Debug Page</h1>

                {/* Test Category Filter */}
                <div className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold">Test Category Filter Logic</h2>
                    <CategoryFilterDebug />
                </div>

                {/* Test với sample data */}
                <div className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold">Test với Sample Data</h2>
                    <CategoryTestComponent />
                </div>

                {/* Test với API data */}
                <div>
                    <h2 className="mb-4 text-2xl font-semibold">Test với API Data</h2>
                    <MegaMenuPreview />
                </div>
            </div>
        </div>
    );
};

export default CategoryDebugPage;
