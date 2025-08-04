import AreaChartTemplate from "@/components/Admin/Chart/AreaChart";
import BarChartTemplate from "@/components/Admin/Chart/BarChart";
import PieChartTemplate from "@/components/Admin/Chart/PieChart";
import { FooterAdmin } from "@/components/Admin/FooterAdmin";
import RevenueDateSelector from "@/components/Admin/RevenueDateSelector";
import { overviewData, topProducts } from "@/constants";
import { useTheme } from "@/context/ThemeContext";
import { Package, PencilLine, Star, Trash, TrendingUp, DollarSign, ShoppingCart, BarChart3 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getLastThirtyDaysRevenue, getLastSevenDaysRevenue, getCurrentMonthRevenue, getCurrentYearRevenue } from "@/api/service/RevenueService";
import { formatCurrency, formatNumber } from "@/utils/formatUtils";

const Dashboard = () => {
    const [allProducts, setAllProducts] = useState({ items: [] });
    const [revenueData, setRevenueData] = useState([]);
    const [revenueStats, setRevenueStats] = useState({
        totalNetRevenue: 0,
        totalPaidOrderCount: 0,
        totalDiscountAmount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [currentPeriod, setCurrentPeriod] = useState("30days");
    const { theme } = useTheme();
    const ProductsListAPI = useLoaderData();

    useEffect(() => {
        setAllProducts(ProductsListAPI);
    }, [ProductsListAPI]);

    // Fetch revenue data
    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                setLoading(true);
                const response = await getLastThirtyDaysRevenue();

                // Transform data cho AreaChart
                const chartData = response.dataPoints.map((point) => ({
                    name: point.timeLabel,
                    revenue: point.netRevenue,
                    orders: point.paidOrderCount,
                    discount: point.discountAmount,
                }));

                setRevenueData(chartData);
                setRevenueStats({
                    totalNetRevenue: response.totalNetRevenue,
                    totalPaidOrderCount: response.totalPaidOrderCount,
                    totalDiscountAmount: response.totalDiscountAmount,
                });
            } catch (error) {
                console.error("Error fetching revenue data:", error);
                // Fallback to dummy data if API fails
                setRevenueData(overviewData);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenueData();
    }, []);

    // Handle date range change
    const handleDateRangeChange = async (period) => {
        try {
            setLoading(true);
            setCurrentPeriod(period.value);
            let response;

            switch (period.value) {
                case "7days":
                    response = await getLastSevenDaysRevenue();
                    break;
                case "30days":
                    response = await getLastThirtyDaysRevenue();
                    break;
                case "currentMonth":
                    response = await getCurrentMonthRevenue();
                    break;
                case "currentYear":
                    response = await getCurrentYearRevenue();
                    break;
                default:
                    response = await getLastThirtyDaysRevenue();
            }

            // Transform data cho AreaChart
            const chartData = response.dataPoints.map((point) => ({
                name: point.timeLabel,
                revenue: point.netRevenue,
                orders: point.paidOrderCount,
                discount: point.discountAmount,
            }));

            setRevenueData(chartData);
            setRevenueStats({
                totalNetRevenue: response.totalNetRevenue,
                totalPaidOrderCount: response.totalPaidOrderCount,
                totalDiscountAmount: response.totalDiscountAmount,
            });
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get period label for display
    const getPeriodLabel = () => {
        switch (currentPeriod) {
            case "7days":
                return "7 ngày qua";
            case "30days":
                return "30 ngày qua";
            case "currentMonth":
                return "Tháng này";
            case "currentYear":
                return "Năm này";
            default:
                return "30 ngày qua";
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* Title */}
            <h1 className="title">Dashboard</h1>

            {/* <div className="grid grid-cols-1 gap-4">
                <div className="card">
                    <h1 className="card-title">Sơ đồ piechart Cho Tổng số lượng sản phẩm theo loại gỗ</h1>
                    <PieChartTemplate apiData={allProducts} />
                </div>
            </div> */}

            <BarChartTemplate />

            {/* Khu vực hiển thị grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {/* Total Revenue */}
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-green-500/20 p-2 text-green-500 transition-colors dark:bg-green-600/20 dark:text-green-600">
                            <DollarSign size={26} />
                        </div>

                        <p className="card-title">Tổng Doanh Thu</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {loading ? "..." : formatCurrency(revenueStats.totalNetRevenue)}
                        </p>

                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-green-500 px-2 py-1 font-medium text-green-500 dark:border-green-600 dark:text-green-600">
                            <TrendingUp size={18} />
                            {getPeriodLabel()}
                        </span>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-orange-500/20 p-2 text-orange-500 transition-colors dark:bg-orange-600/20 dark:text-orange-600">
                            <ShoppingCart size={26} />
                        </div>

                        <p className="card-title">Đơn Hàng Đã Thanh Toán</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {loading ? "..." : formatNumber(revenueStats.totalPaidOrderCount)}
                        </p>

                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-orange-500 px-2 py-1 font-medium text-orange-500 dark:border-orange-600 dark:text-orange-600">
                            <BarChart3 size={18} />
                            {getPeriodLabel()}
                        </span>
                    </div>
                </div>

                {/* Total Products */}
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Package size={26} />
                        </div>

                        <p className="card-title">Tổng Sản Phẩm</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{allProducts?.items?.length || 0}</p>

                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            Có sẵn
                        </span>
                    </div>
                </div>

                {/* Total Discounts */}
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-purple-500/20 p-2 text-purple-500 transition-colors dark:bg-purple-600/20 dark:text-purple-600">
                            <Package size={26} />
                        </div>

                        <p className="card-title">Tổng Giảm Giá</p>
                    </div>

                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {loading ? "..." : formatCurrency(revenueStats.totalDiscountAmount)}
                        </p>

                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-purple-500 px-2 py-1 font-medium text-purple-500 dark:border-purple-600 dark:text-purple-600">
                            <TrendingUp size={18} />
                            {getPeriodLabel()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    {/* Header với time selector */}
                    <div className="card-header">
                        <div className="flex flex-col gap-4">
                            <p className="card-title">Tổng Quan Doanh Thu</p>
                            <RevenueDateSelector
                                onDateRangeChange={handleDateRangeChange}
                                loading={loading}
                            />
                        </div>
                    </div>

                    {/* Biểu đồ */}
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <p className="text-gray-500">Đang tải dữ liệu doanh thu...</p>
                            </div>
                        ) : (
                            <AreaChartTemplate
                                data={revenueData}
                                dataKey="revenue"
                                theme={theme}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">Đơn Hàng Hàng Đầu</div>
                </div>
                {/* Product Table */}
                <div className="card-body p-0">
                    <div className="relative h-fit w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            {/* thead.table-header>tr.table-row>th.table-head*6 */}
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Sản Phẩm</th>
                                    <th className="table-head">Giá</th>
                                    <th className="table-head">Trạng Thái</th>
                                    <th className="table-head">Đánh Giá</th>
                                    <th className="table-head">Hành Động</th>
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
