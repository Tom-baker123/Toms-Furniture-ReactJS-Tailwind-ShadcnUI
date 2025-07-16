import React from "react";
import { Package } from "lucide-react";

const ProfileOrdersTab = () => (
    <div>
        <h2 className="mb-3 text-2xl font-bold text-black">Order History</h2>
        <div className="space-y-4">
            {[1, 2, 3].map((order) => (
                <div
                    key={order}
                    className="rounded-xl border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-sm"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <Package className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Order #00{order}</h3>
                                <p className="text-sm text-gray-500">Placed on Jan {order}0, 2024</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-900">$299.99</p>
                            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">Delivered</span>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <p className="text-gray-600">2 items • Modern Chair, Coffee Table</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ProfileOrdersTab;
