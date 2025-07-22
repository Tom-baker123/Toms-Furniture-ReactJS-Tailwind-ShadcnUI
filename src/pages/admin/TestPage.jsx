import React from "react";
import { useLoaderData } from "react-router-dom";

const TestPage = () => {
    const data = useLoaderData();

    return <div>{/* {data.map((item, index) => <div key={index}>{item.name}</div>)} */}</div>;
};

export default TestPage;
