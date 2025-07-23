import React, { useState, useEffect } from "react";
import { getAllTests, createTest, updateTest, deleteTest } from "@/api/service/TestService";
import useApiFetch from "@/hooks/useApiFetch";

const TestPage = () => {
    const [state, setState] = useState({ tests: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState({ name: "" });
    const [editId, setEditId] = useState(null);

    const fetchData = useApiFetch(setLoading, setError, setState);

    // Lấy danh sách Test khi component mount
    useEffect(() => {
        fetchData(getAllTests, "tests");
    }, [fetchData]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý validate
    const validateForm = () => {
        if (!form.name.trim()) {
            setError("Tên test không được để trống");
            return false;
        }
        if (form.name.length < 5) {
            setError("Tên test phải có ít nhất 5 ký tự");
            return false;
        }
        return true;
    };

    // Xử lý submit form (tạo mới hoặc cập nhật)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) return;

        const data = { name: form.name };
        try {
            if (editId) {
                // Cập nhật Test
                const response = await updateTest(editId, data);
                if (response.isSuccess) {
                    setSuccess("Cập nhật Test thành công!");
                    fetchData(getAllTests, "tests");
                } else {
                    setError(response.message || "Lỗi khi cập nhật Test");
                }
            } else {
                // Tạo mới Test
                const response = await createTest(data);
                if (response.isSuccess) {
                    setSuccess("Tạo Test thành công!");
                    fetchData(getAllTests, "tests");
                } else {
                    setError(response.message || "Lỗi khi tạo Test");
                }
            }
            setForm({ name: "" });
            setEditId(null);
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra khi xử lý yêu cầu");
        }
    };

    // Xử lý chỉnh sửa Test
    const handleEdit = (item) => {
        setForm({ name: item.name });
        setEditId(item.id);
    };

    // Xử lý xóa Test
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa Test này?")) {
            try {
                const response = await deleteTest(id);
                if (response.isSuccess) {
                    setSuccess("Xóa Test thành công!");
                    fetchData(getAllTests, "tests");
                } else {
                    setError(response.message || "Lỗi khi xóa Test");
                }
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi xóa Test");
            }
        }
    };

    // Format ngày tháng sang định dạng tiếng Việt
    const formatDate = (date) => {
        return date
            ? new Date(date).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
              })
            : "-";
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-6 text-center text-3xl font-bold">Quản lý Test</h1>

            {/* Thông báo */}
            {error && <div className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</div>}
            {success && <div className="mb-4 rounded bg-green-100 p-4 text-green-700">{success}</div>}
            {loading && <div className="text-center">Đang tải...</div>}

            {/* Form nhập liệu */}
            <form
                onSubmit={handleSubmit}
                className="mb-6 flex flex-col gap-4 sm:flex-row"
            >
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập tên Test"
                    className="flex-1 rounded-md border-2 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                        {editId ? "Cập nhật" : "Tạo mới"}
                    </button>
                    {editId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditId(null);
                                setForm({ name: "" });
                            }}
                            className="rounded bg-gray-400 px-4 py-2 text-white transition-colors hover:bg-gray-500"
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            {/* Bảng danh sách Test */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-3 text-left">#</th>
                            <th className="border p-3 text-left">Tên Test</th>
                            <th className="border p-3 text-left">Ngày Tạo</th>
                            <th className="border p-3 text-left">Ngày Cập Nhật</th>
                            <th className="border p-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.tests.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50"
                            >
                                <td className="border p-3">{item.id}</td>
                                <td className="border p-3">{item.name}</td>
                                <td className="border p-3">{formatDate(item.createdDate)}</td>
                                <td className="border p-3">{formatDate(item.updatedDate)}</td>
                                <td className="border p-3">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="mr-2 rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TestPage;
