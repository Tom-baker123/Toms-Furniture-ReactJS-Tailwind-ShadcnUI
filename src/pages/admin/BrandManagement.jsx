import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteBrand } from "@/api/api";
import toast from "react-hot-toast";

const BrandManagement = () => {
    const brands = useLoaderData();
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this brand?")) {
            try {
                await deleteBrand(id);
                toast.success("Brand deleted successfully!");
                navigate(0); // Reload trang
            } catch (error) {
                toast.error(`Error deleting brand: ${error.message}`);
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
                <div className="title">Brand Management</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    onClick={() => navigate("/admin/brands/New_Brand")}
                >
                    Add Brand
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Brands</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Image</th>
                                    <th className="table-head">Brand Name</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {brands.map((brand) => (
                                    <tr
                                        key={brand.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{brand.id}</td>
                                        <td className="table-cell">
                                            {brand.imageUrl ? (
                                                <img
                                                    src={brand.imageUrl}
                                                    alt={brand.brandName}
                                                    width={50}
                                                    height={50}
                                                />
                                            ) : (
                                                "No image"
                                            )}
                                        </td>
                                        <td className="table-cell">{brand.brandName}</td>
                                        <td className="table-cell">{brand.isActive ? "Active" : "Inactive"}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/brands/Edit_Brand/${brand.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(brand.id)}
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandManagement;
