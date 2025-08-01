import React from "react";
import { PencilLine, Trash } from "lucide-react";
import { useNavigate, useLoaderData } from "react-router-dom";
import BlogService from "@/api/service/BlogService";
import toast from "react-hot-toast";
import FormatDatetime from "@/hooks/FormatDatetime";

const BlogManagement = () => {
    const blogs = useLoaderData() || [];
    const navigate = useNavigate();

    // Xóa tin tức
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) {
            const res = await BlogService.deleteNews(id);
            if (res.success === false) {
                toast.error(res.message || "Xóa tin tức thất bại");
            } else {
                toast.success("Xóa tin tức thành công!");
                window.location.reload();
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between">
                <div className="title text-2xl font-bold">Quản lý tin tức</div>
                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/admin/blog_management/new_blog")}
                >
                    Thêm tin tức
                </button>
            </div>
            <div className="card rounded-sm shadow-xs">
                <div className="card-header p-4">
                    <div className="card-title text-lg font-bold">Tất cả tin tức</div>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table w-full">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head whitespace-nowrap">#</th>
                                    <th className="table-head whitespace-nowrap">Hình ảnh</th>
                                    <th className="table-head whitespace-nowrap">Tiêu đề</th>
                                    <th className="table-head whitespace-nowrap">Trạng thái</th>
                                    <th className="table-head whitespace-nowrap">Ngày tạo</th>
                                    <th className="table-head whitespace-nowrap">Ngày cập nhật</th>
                                    <th className="table-head whitespace-nowrap">Người tạo</th>
                                    <th className="table-head whitespace-nowrap">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {blogs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="py-8 text-center font-semibold text-gray-400"
                                        >
                                            Không có tin tức nào
                                        </td>
                                    </tr>
                                ) : (
                                    blogs.map((blog) => (
                                        <tr
                                            key={blog.id}
                                            className="table-row hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="table-cell">{blog.id}</td>
                                            <td className="table-cell">
                                                {blog.newsAvatar ? (
                                                    <img
                                                        src={blog.newsAvatar}
                                                        alt={blog.title}
                                                        className="h-12 w-12 rounded bg-gray-100 object-cover shadow"
                                                    />
                                                ) : (
                                                    "Không có ảnh"
                                                )}
                                            </td>
                                            <td className="table-cell">{blog.title}</td>
                                            <td className="table-cell">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs text-ellipsis ${blog.isActive ? "bg-teal-100 text-teal-800" : "bg-gray-200 text-gray-600"}`}
                                                >
                                                    {blog.isActive ? "Hiển thị" : "Ẩn"}
                                                </span>
                                            </td>
                                            <td className="table-cell">{FormatDatetime(blog.createdDate) || "--"}</td>
                                            <td className="table-cell">{FormatDatetime(blog.updatedDate) || "--"}</td>
                                            <td className="table-cell">{blog.createdBy || blog.userName || "--"}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-x-4">
                                                    <button
                                                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                        onClick={() => navigate(`/admin/blog_management/edit_blog/${blog.id}`)}
                                                    >
                                                        <PencilLine size={20} />
                                                    </button>
                                                    <button
                                                        className="cursor-pointer text-red-500 hover:text-red-700"
                                                        onClick={() => handleDelete(blog.id)}
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogManagement;
