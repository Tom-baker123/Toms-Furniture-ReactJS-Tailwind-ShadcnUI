import React, { useState, useMemo } from "react";
import { PencilLine, Trash, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteUser, updateUser } from "@/api/api";
import buildUserUpdatePayload from "@/lib/buildUserUpdatePayload";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";
import { useMediaQuery } from "@uidotdev/usehooks";

const UserManagement = () => {
    const data = useLoaderData();
    const users = data?.users || []; // Lấy danh sách người dùng từ loader
    const navigate = useNavigate();
    // Xác định breakpoint bằng uidotdev cho responsive
    const isTablet = useMediaQuery("(min-width: 768px)"); // Kiểm tra thiết bị là tablet

    // State để quản lý sắp xếp
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    // Xử lý xóa người dùng
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
            try {
                await deleteUser(id);
                toast.success("Xóa người dùng thành công!");
                navigate(0); // Reload trang
            } catch (error) {
                toast.error(`Lỗi khi xóa người dùng: ${error.message}`);
            }
        }
    };

    // Hàm cập nhật trạng thái trực tiếp
    const handleToggleActive = async (user) => {
        try {
            const payload = buildUserUpdatePayload(user);
            await updateUser(user.id, payload);
            toast.success("Cập nhật trạng thái thành công!");
            navigate(0); // Reload trang để cập nhật danh sách
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại");
        }
    };

    // Hàm xử lý sắp xếp
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Hàm sắp xếp dữ liệu
    const sortedUsers = useMemo(() => {
        if (!sortConfig.key) return users;

        return [...users].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            switch (sortConfig.key) {
                case "id":
                    aVal = Number(aVal);
                    bVal = Number(bVal);
                    break;
                case "userName":
                case "email":
                case "gender":
                case "roleName":
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();
                    break;
                case "isActive":
                    aVal = aVal ? 1 : 0;
                    bVal = bVal ? 1 : 0;
                    break;
                case "createdDate":
                case "updatedDate":
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                    break;
                default:
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();
            }

            if (aVal < bVal) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aVal > bVal) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [users, sortConfig]);

    // Component cho header có thể sắp xếp
    const SortableHeader = ({ children, sortKey, className = "" }) => {
        const isActive = sortConfig.key === sortKey;
        const direction = sortConfig.direction;

        return (
            <th
                className={`table-head cursor-pointer whitespace-nowrap transition-all select-none hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
                onClick={() => handleSort(sortKey)}
            >
                <div className="flex items-center justify-between">
                    <span>{children}</span>
                    <div className="ml-1 flex flex-col">
                        <ChevronUp
                            size={15}
                            className={`stroke-3 ${isActive && direction === "asc" ? "text-blue-600" : "text-gray-400"}`}
                        />
                        <ChevronDown
                            size={15}
                            className={`stroke-3 ${isActive && direction === "desc" ? "text-blue-600" : "text-gray-400"} -mt-1`}
                        />
                    </div>
                </div>
            </th>
        );
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
                <div className="title whitespace-nowrap">Quản lý User</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    onClick={() => navigate("/admin/users/New_User")}
                >
                    {isTablet ? "Thêm người dùng" : <Plus />}
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Danh sách người dùng</div>
                    {sortConfig.key && (
                        <div className="text-sm text-gray-500">
                            Sắp xếp theo {sortConfig.key} ({sortConfig.direction === "asc" ? "tăng dần" : "giảm dần"})
                        </div>
                    )}
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <SortableHeader sortKey="id">#</SortableHeader>
                                    <SortableHeader sortKey="userName">Tên người dùng</SortableHeader>
                                    <SortableHeader sortKey="email">Email</SortableHeader>
                                    <SortableHeader sortKey="gender">Giới tính</SortableHeader>
                                    <SortableHeader sortKey="roleName">Vai trò</SortableHeader>
                                    <SortableHeader sortKey="isActive">Trạng thái</SortableHeader>
                                    <SortableHeader sortKey="createdDate">Ngày tạo</SortableHeader>
                                    <SortableHeader sortKey="updatedDate">Ngày cập nhật</SortableHeader>
                                    <th className="table-head whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {sortedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{user.id}</td>
                                        <td className="table-cell">{user.userName}</td>
                                        <td className="table-cell">{user.email}</td>
                                        <td className="table-cell">{user.gender}</td>
                                        <td className="table-cell">{user.roleName}</td>
                                        <td className="table-cell">
                                            <button
                                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${user.isActive ? "bg-teal-500" : "bg-gray-300"}`}
                                                onClick={() => handleToggleActive(user)}
                                                title="Toggle status"
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${user.isActive ? "translate-x-6" : "translate-x-1"}`}
                                                />
                                                <span className="absolute left-1 text-xs font-bold text-gray-400 select-none"></span>
                                                <span className="absolute right-1 text-xs font-bold text-teal-700 select-none"></span>
                                            </button>
                                        </td>
                                        <td className="table-cell">{FormatDatetime(user.createdDate) || "N/A"}</td>
                                        <td className="table-cell">{FormatDatetime(user.updatedDate) || "N/A"}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/users/Edit_User/${user.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(user.id)}
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

export default UserManagement;
