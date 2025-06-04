import React from "react";
import { AllCategories, topProducts } from "@/constants";
import { PencilLine, Star, Trash } from "lucide-react";
import { useLoaderData } from "react-router-dom";

const ProductCollection = () => {
    const categories =useLoaderData(); // 👈 get data from loader

    return (
        <div className="flex flex-col gap-y-4">
            <div className="title">Product Collection</div>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">All Categories</div>
                </div>
                {/* Product Table */}
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            {/* thead.table-header>tr.table-row>th.table-head*6 */}
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Name Collection</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {AllCategories.map((product, proIndex) => (
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
                                        
                                        <td className="table-cell">{product.status}</td>
                                        
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
        </div>
    );
};

export default ProductCollection;
