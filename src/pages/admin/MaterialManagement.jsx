import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteMaterial } from "@/api/api";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

// Component hiển thị danh sách vật liệu
const MaterialManagement = () => {
    const materials = useLoaderData(); // Lấy dữ liệu vật liệu từ loader
    const navigate = useNavigate();

    // Hàm xử lý xóa vật liệu
    const handleDelete = async (id) => {
        // Hiển thị xác nhận xóa
        if (window.confirm("Are you sure you want to delete this material?")) {
            try {
                await deleteMaterial(id);
                toast.success("Material deleted successfully!"); // Thông báo thành công
                navigate(0); // Reload trang để cập nhật danh sách
            } catch (error) {
                toast.error(`Error deleting material: ${error.message}`); // Thông báo lỗi
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Tiêu đề và nút thêm mới */}
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800">Material Management</div> {/* Tiêu đề bằng tiếng Anh */}
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/admin/materials/new_material")}
                >
                    Add Material {/* Nút thêm bằng tiếng Anh */}
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Materials</div> {/* Tiêu đề bảng bằng tiếng Anh */}
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Material Name</th>
                                    <th className="table-head whitespace-nowrap">Status</th>
                                    <th className="table-head whitespace-nowrap">Created Date</th>
                                    <th className="table-head whitespace-nowrap">Updated Date</th>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {materials.map((material) => (
                                    <tr
                                        key={material.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{material.id}</td>
                                        <td className="table-cell">{material.materialName}</td>
                                        {/* <td className="table-cell">{material.isActive ? "Active" : "Inactive"}</td>
                                        <td className="table-cell">{new Date(material.createdDate).toLocaleDateString()}</td>
                                        <td className="table-cell">
                                            {material.updatedDate ? new Date(material.updatedDate).toLocaleDateString() : "N/A"}
                                        </td> */}
                                        <td className="table-cell">
                                            {material.isActive ? (
                                                <div className="w-fit rounded-full bg-teal-100 px-5 py-1 text-sm text-teal-700">Active</div>
                                            ) : (
                                                <div className="w-fit rounded-full bg-red-100 px-5 py-1 text-sm text-red-700">Inactive</div>
                                            )}
                                        </td>
                                        <td className="table-cell">{FormatDatetime(material.createdDate) || "N/A"}</td>
                                        <td className="table-cell">
                                            {FormatDatetime(material.updatedDate) ? FormatDatetime(new Date(material.updatedDate)) : "N/A"}
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/materials/edit_material/${material.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(material.id)}
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

export default MaterialManagement;
