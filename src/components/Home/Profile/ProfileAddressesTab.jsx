import React from "react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { Plus, MapPin } from "lucide-react";
import AddressModal from "@/components/Home/AddressModal";

const ProfileAddressesTab = ({
    savedAddresses,
    handleEditAddress,
    handleDeleteAddress,
    showAddressModal,
    setShowAddressModal,
    setEditingAddress,
    handleSaveAddress,
    editingAddress,
}) => (
    <div>
        <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">Saved Addresses</h2>
            <ButtonHovCT
                onClick={() => {
                    setEditingAddress(null);
                    setShowAddressModal(true);
                }}
                bgColor="bg-black"
                hoverBgColor="bg-gray-800"
                textColor="text-white"
                hoverTextColor="text-white"
                border={false}
            >
                <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add New Address</span>
                </div>
            </ButtonHovCT>
        </div>
        <div className="space-y-4">
            {savedAddresses.map((address) => (
                <div
                    key={address.id}
                    className="rounded-xl border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-sm"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="flex items-center font-semibold text-gray-900">
                                <MapPin className="mr-2 h-4 w-4 text-gray-600" />
                                {address.label}
                                {address.isDefault && <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">Default</span>}
                            </h3>
                            <div className="mt-2 space-y-1">
                                <p className="font-medium text-gray-900">{address.fullName}</p>
                                <p className="text-gray-600">{address.phone}</p>
                                <p className="text-gray-600">{address.address}</p>
                                <p className="text-gray-600">
                                    {address.city}, {address.state} {address.zipCode}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <ButtonHovCT
                                onClick={() => handleEditAddress(address)}
                                bgColor="bg-gray-100"
                                hoverBgColor="bg-gray-200"
                                textColor="text-gray-700"
                                hoverTextColor="text-gray-900"
                                border={false}
                                className="!px-3 !py-2"
                            >
                                Edit
                            </ButtonHovCT>
                            <ButtonHovCT
                                onClick={() => handleDeleteAddress(address.id)}
                                bgColor="bg-red-100"
                                hoverBgColor="bg-red-200"
                                textColor="text-red-700"
                                hoverTextColor="text-red-900"
                                border={false}
                                className="!px-3 !py-2"
                            >
                                Delete
                            </ButtonHovCT>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        {/* Address Modal */}
        <AddressModal
            open={showAddressModal}
            onClose={() => {
                setShowAddressModal(false);
                setEditingAddress(null);
            }}
            onSave={handleSaveAddress}
            editingAddress={editingAddress}
        />
    </div>
);

export default ProfileAddressesTab;
