import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PieChartTemplate = ({ apiData }) => {
    const items = Array.isArray(apiData?.items) ? apiData.items : [];

    let oakCount = 0;
    let pineCount = 0;

    items.forEach((item) => {
        if (Array.isArray(item?.productVariants)) {
            item?.productVariants.forEach((variant) => {
                if (variant.materialName === "Oak") oakCount++;
                if (variant.materialName === "Pine") pineCount++;
            });
        }
    });

    const data = [
        { name: "Oak", value: oakCount },
        { name: "Pine", value: pineCount },
    ];

    // const data = items.map((items) => ({
    //     name: items.productName || "Không rõ nguồn góc",
    //     value: Array.isArray(items?.productVariants) ? items.productVariants.length : 0,
    // }));
    const COLORS = ["#2563eb", "#94a3b8"]; // Green for Oak, Orange for Pine

    return (
        <div className="">
            <ResponsiveContainer
                width="100%"
                height={250}
            >
                <PieChart
                    width={300}
                    height={300}
                >
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartTemplate;
