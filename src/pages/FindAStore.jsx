import React, { useState } from "react";

const usersData = [
    { id: 1, name: "An", age: 25, email: "an@gmail.com" },
    { id: 2, name: "Bình", age: 22, email: "binh@yahoo.com" },
    { id: 3, name: "Cường", age: 30, email: "cuong@outlook.com" },
];

const FindAStore = () => {
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDirection("asc");
        }
    };

    const sortedData = [...usersData].sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        if (typeof valueA === "string") {
            return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }
    });

    const getSortIcon = (field) => {
        if (sortBy !== field) return "↕️";
        return sortDirection === "asc" ? "⬆️" : "⬇️";
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">Bảng người dùng (Sortable)</h2>
            <table className="min-w-full border border-gray-200 bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th
                            className="cursor-pointer p-3 text-left"
                            onClick={() => handleSort("name")}
                        >
                            Tên {getSortIcon("name")}
                        </th>
                        <th
                            className="cursor-pointer p-3 text-left"
                            onClick={() => handleSort("age")}
                        >
                            Tuổi {getSortIcon("age")}
                        </th>
                        <th
                            className="cursor-pointer p-3 text-left"
                            onClick={() => handleSort("email")}
                        >
                            Email {getSortIcon("email")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((user) => (
                        <tr
                            key={user.id}
                            className="border-t hover:bg-gray-50"
                        >
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.age}</td>
                            <td className="p-3">{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FindAStore;
