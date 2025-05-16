import axios from "axios";
import React, { useEffect, useState } from "react";

const GetAPI = () => {
    const url = "https://67b7f5c32bddacfb27107b27.mockapi.io/users";
    const [data, setData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        loadData();
    }, []);
    // return <div className="container-custom flex flex-wrap">{data.map((item) => (
    //     <div key={item.id} className="">{item.name}</div>
    // ))}</div>;

    return (
        <>
            <div class="container-custom relative overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                    <thead class="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th>createdAt</th>
                            <th>id</th>
                            <th>name</th>
                            <th>age</th>
                            <th>add</th>
                            <th>avatar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                <th
                                    scope="row"
                                    class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                                >
                                    {item.createdAt}
                                </th>
                                <th>{item.id}</th>
                                <th>{item.name}</th>
                                <th>{item.age}</th>
                                <th>{item.add}</th>
                                <th>
                                    <img
                                        src={item.avatar}
                                        alt=""
                                        width={20}
                                        height={20}
                                    />
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default GetAPI;
