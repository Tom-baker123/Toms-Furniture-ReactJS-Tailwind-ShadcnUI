import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteSupplier } from "@/api/api";
import toast from "react-hot-toast";

// Component hiển thị danh sách nhà cung cấp
const SupplierManagement = () => {
    const suppliers = useLoaderData(); // Lấy dữ liệu từ loader
    const navigate = useNavigate();

    // Hàm xử lý xóa nhà cung cấp
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            // Thông báo xác nhận bằng tiếng Anh
            try {
                await deleteSupplier(id);
                toast.success("Supplier deleted successfully!"); // Thông báo thành công bằng tiếng Anh
                navigate(0); // Reload trang
            } catch (error) {
                toast.error(`Error deleting supplier: ${error.message}`); // Thông báo lỗi bằng tiếng Anh
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
                <div className="title text-2xl font-bold text-slate-800">Supplier Management</div> {/* Tiêu đề bằng tiếng Anh */}
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/admin/suppliers/new_supplier")}
                >
                    Add Supplier {/* Nút thêm bằng tiếng Anh */}
                </button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Suppliers</div> {/* Tiêu đề bảng bằng tiếng Anh */}
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Supplier</th> {/* Cột bằng tiếng Anh */}
                                    <th className="table-head whitespace-nowrap">Status</th>
                                    <th className="table-head whitespace-nowrap">Phone Number</th>
                                    <th className="table-head whitespace-nowrap">Email</th>
                                    <th className="table-head whitespace-nowrap">Debt</th>
                                    <th className="table-head whitespace-nowrap">Total</th>
                                    <th className="table-head whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {suppliers.map((supplier) => (
                                    <tr
                                        key={supplier.id}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{supplier.id}</td>
                                        <td className="table-cell">{supplier.supplierName || "N/A"}</td>
                                        <td className="table-cell">{supplier.isActive ? "Active" : "Inactive"}</td> {/* Trạng thái bằng tiếng Anh */}
                                        <td className="table-cell">{supplier.phoneNumber || "N/A"}</td>
                                        <td className="table-cell">{supplier.email}</td>
                                        <td className="table-cell text-right">0 USD</td> {/* Giả định, cần API tính toán */}
                                        <td className="table-cell text-right">0 USD</td> {/* Giả định, cần API tính toán */}
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    className="cursor-pointer text-blue-500 dark:text-blue-600"
                                                    onClick={() => navigate(`/admin/suppliers/edit_supplier/${supplier.id}`)}
                                                >
                                                    <PencilLine size={20} />
                                                </button>
                                                <button
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => handleDelete(supplier.id)}
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

export default SupplierManagement;
