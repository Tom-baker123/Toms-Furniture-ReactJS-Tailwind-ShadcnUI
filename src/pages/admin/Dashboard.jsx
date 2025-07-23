import { getAllProducts } from "@/api/api";
import AreaChartTemplate from "@/components/Admin/Chart/AreaChart";
import BarChartTemplate from "@/components/Admin/Chart/BarChart";
import PieChartTemplate from "@/components/Admin/Chart/PieChart";
import { FooterAdmin } from "@/components/Admin/FooterAdmin";
import { overviewData, topProducts } from "@/constants";
import { useTheme } from "@/context/ThemeContext";
import { Package, PencilLine, Star, Trash, TrendingUp } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

const Dashboard = () => {
    const [allProducts, setAllProducts] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                const data = await getAllProducts();
                setAllProducts(data);
            } catch (err) {
                setError("Không thể tải sản phẩm: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    return (
        <div className="flex flex-col gap-y-4">
            {/* Title */}
            <h1 className="title">Dashboard</h1>

            <div className="grid grid-cols-1 gap-4 ">
                <div className="card">
                    <h1 className="card-title">Sơ đồ piechart Cho Tổng số lượng sản phẩm theo loại gỗ</h1>
                    <PieChartTemplate apiData={allProducts} />
                </div>
            </div>
            <div className="card">
                <h1 className="card-title">Sơ đồ piechart Cho Tổng số lượng sản phẩm theo loại gỗ</h1>
                <BarChartTemplate />
            </div>

            {/* Khu vực hiển thị grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Package size={26} />
                        </div>

                        <p className="card-title">Total Products</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">25, 154</p>

                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            25%
                        </span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Package size={26} />
                        </div>

                        <p className="card-title">Total Products</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">25, 154</p>

                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            25%
                        </span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Package size={26} />
                        </div>

                        <p className="card-title">Total Products</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">25, 154</p>

                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            25%
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    {/* Thẻ thống kê */}
                    <div className="card-header">
                        <p className="card-title">Overview</p>
                    </div>

                    {/* Biểu đồ */}
                    <div className="card-body p-0">
                        <AreaChartTemplate
                            data={overviewData}
                            theme={theme}
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">Top Orders</div>
                </div>
                {/* Product Table */}
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            {/* thead.table-header>tr.table-row>th.table-head*6 */}
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Product</th>
                                    <th className="table-head">Price</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Rating</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {topProducts.map((product, proIndex) => (
                                    <tr
                                        key={proIndex}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{product.number}</td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    <p className="font-normal text-slate-600 dark:text-shadow-slate-400">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">${product.price}</td>
                                        <td className="table-cell">{product.status}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-2">
                                                <Star
                                                    size={18}
                                                    className="fill-yellow-600 stroke-yellow-600"
                                                />
                                                {product.rating}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button className="text-blue-500 dark:text-blue-600">
                                                    <PencilLine size={20} />
                                                </button>
                                                <button className="text-red-500">
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
            {/* <EditorCDN /> */}
            <FooterAdmin />
        </div>
    );
};

export default Dashboard;
