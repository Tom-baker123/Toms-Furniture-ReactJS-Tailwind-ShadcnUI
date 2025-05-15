import axios from "axios";
import React, { useEffect, useState } from "react";

const GetAPI = () => {
    const url = "https://67b7f5c32bddacfb27107b27.mockapi.io/product";
    const [data, setData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                console.log(error)
            }
        };
        loadData();
    }, []);
    return <div className="container-custom flex flex-wrap">{data.map((item) => (
        <div key={item.id} className="">{item.name}</div>
    ))}</div>;
};

export default GetAPI;
