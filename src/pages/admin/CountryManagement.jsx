import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteCountry } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

const CountryManagement = () => {
    const countries = useLoaderData();
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this country?")) {
            try {
                await deleteCountry(id);
                toast.success("Country deleted successfully!");
                navigate(0); // Reload the page
            } catch (error) {
                toast.error(`Error deleting country: ${error.message}`);
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800 dark:text-slate-200">Country Management</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    onClick={() => navigate("/admin/countries/new_country")}
                >
                    Add Country
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title text-lg font-bold text-slate-800 dark:text-slate-200">All Countries</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Image</th>
                                    <th className="table-head whitespace-nowrap">Country Name</th>
                                    <th className="table-head whitespace-nowrap">Status</th>
                                    <th className="table-head whitespace-nowrap">Created Date </th>
                                    <th className="table-head whitespace-nowrap">Updated Date </th>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {countries.map((country) => (
                                    <tr
                                        key={country.id}
                                        className="table-row"
                                    >
                                        {/* [1.] Id của xuất xứ */}
                                        <td className="table-cell">{country.id}</td>
                                        {/* [2.] Ảnh của xuất xứ */}
                                        <td className="table-cell">
                                            {country.imageUrl ? (
                                                <img
                                                    src={country.imageUrl}
                                                    alt={country.countryName}
                                                    width={50}
                                                    height={50}
                                                    className="rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-800 dark:text-gray-200">_</span>
                                            )}
                                        </td>
                                        {/* [3.] Tên của xuất xứ */}
                                        <td className="table-cell">{country.countryName}</td>
                                        {/* [4.] Trạng thái của xuất xứ */}
                                        <td className="table-cell">
                                            {country.isActive ? (
                                                <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Active</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Inactive</div>
                                            )}
                                        </td>
                                        <td className="table-cell">{FormatDatetime(country.createdDate) || "N/A"}</td>
                                        <td className="table-cell">
                                            {FormatDatetime(country.updatedDate) ? FormatDatetime(new Date(country.updatedDate)) : "N/A"}
                                        </td>
                                        {/* [7.] Action của xuất xứ */}
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    onClick={() => navigate(`/admin/countries/edit_country/${country.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                    onClick={() => handleDelete(country.id)}
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

export default CountryManagement;
