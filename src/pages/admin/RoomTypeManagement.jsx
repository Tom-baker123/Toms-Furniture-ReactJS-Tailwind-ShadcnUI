import React, { useState } from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteRoomType, updateRoomType } from "@/api/service/RoomTypeService";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

const RoomTypeManagement = () => {
    const [room_types, setRoomTypes] = useState(useLoaderData());
    const navigate = useNavigate();

    // Xử lý xoá loại phòng
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this room type?")) {
            try {
                await deleteRoomType(id);
                toast.success("Room type deleted successfully!");
                navigate(0);
            } catch (error) {
                toast.error(`Error deleting room type: ${error.message || error}`);
            }
        }
    };

    // Cập nhật trạng thái trực tiếp
    const handleToggleActive = async (roomType) => {
        try {
            const updated = await updateRoomType({
                Id: roomType.id,
                RoomTypeName: roomType.roomTypeName,
                IsActive: !roomType.isActive,
            });
            setRoomTypes((prev) =>
                prev.map((rt) =>
                    rt.id === roomType.id ? { ...rt, isActive: !rt.isActive, updatedDate: updated.updatedDate || new Date().toISOString() } : rt,
                ),
            );
            toast.success("Status updated!");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Tiêu đề và nút thêm loại phòng */}
            <div className="flex justify-between">
                <div className="title text-2xl font-bold">Room Type Management</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/admin/room_types/New_RoomType")}
                >
                    Add Room Type
                </button>
            </div>
            {/* Bảng hiển thị danh sách loại phòng */}
            <div className="card rounded-sm shadow-xs">
                <div className="card-header p-4">
                    <div className="card-title text-lg font-bold">All Room Types</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Image</th>
                                    <th className="table-head whitespace-nowrap">Room Type Name</th>
                                    <th className="table-head whitespace-nowrap">Slug</th>
                                    <th className="table-head whitespace-nowrap">Status</th>
                                    <th className="table-head whitespace-nowrap">Created Date</th>
                                    <th className="table-head whitespace-nowrap">Updated Date</th>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {room_types.map((roomType) => (
                                    <tr
                                        key={roomType.id}
                                        className="table-row hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <td className="table-cell">{roomType.id}</td>
                                        <td className="table-cell">
                                            {roomType.imageUrl ? (
                                                <img
                                                    src={roomType.imageUrl}
                                                    alt={roomType.roomTypeName}
                                                    className="h-12 w-12 rounded object-cover shadow"
                                                />
                                            ) : (
                                                "No image"
                                            )}
                                        </td>
                                        <td className="table-cell">{roomType.roomTypeName}</td>
                                        <td className="table-cell">{roomType.slug}</td>
                                        <td className="table-cell">
                                            <button
                                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${roomType.isActive ? "bg-teal-500" : "bg-gray-300"}`}
                                                onClick={() => handleToggleActive(roomType)}
                                                title="Toggle status"
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${roomType.isActive ? "translate-x-6" : "translate-x-1"}`}
                                                />
                                                <span className="absolute left-1 text-xs font-bold text-gray-400 select-none"></span>
                                                <span className="absolute right-1 text-xs font-bold text-teal-700 select-none"></span>
                                            </button>
                                        </td>
                                        <td className="table-cell">{FormatDatetime(roomType.createdDate) || "N/A"}</td>
                                        <td className="table-cell">{FormatDatetime(roomType.updatedDate) || "N/A"}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                    onClick={() => navigate(`/admin/room_types/Edit_RoomType/${roomType.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(roomType.id)}
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

export default RoomTypeManagement;
