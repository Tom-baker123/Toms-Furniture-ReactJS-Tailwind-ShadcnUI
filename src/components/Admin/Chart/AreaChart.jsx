import React from "react";
import { overviewData, topProducts } from "@/constants";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/context/ThemeContext";
import { formatCurrency } from "@/utils/formatUtils";

const AreaChartTemplate = ({ data = overviewData, dataKey = "total" }) => {
    const { theme } = useTheme();
    return (
        <>
            <ResponsiveContainer
                width={"100%"}
                height={300}
            >
                <AreaChart
                    data={data}
                    margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
                >
                    <defs>
                        <linearGradient
                            id="colorTotal"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#2563eb"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#2563eb"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    {/* Tooltip hiển thị trong biểu đồ */}
                    <Tooltip
                        cursor={false}
                        formatter={(value) => formatCurrency(value)}
                    />
                    <XAxis
                        dataKey="name"
                        strokeWidth={0}
                        stroke={theme === "light" ? "#475569" : "#94a3b8"}
                        tickMargin={6}
                    />
                    <YAxis
                        strokeWidth={0}
                        stroke={theme === "light" ? "#475569" : "#94a3b8"}
                        tickFormatter={(value) => formatCurrency(value)}
                        tickMargin={10}
                        width={100}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke="#2563eb"
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};

export default AreaChartTemplate;
