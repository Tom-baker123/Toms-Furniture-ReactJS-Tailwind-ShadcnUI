import React, { useEffect } from "react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { Plus, MapPin } from "lucide-react";
import AddressModal from "@/components/Home/AddressModal";
import { useGHN } from "../../../context/GHNContext";
import { formatAddressDisplay, parseDropdownValue } from "../../../lib/addressDropdownUtils";

const ProfileAddressesTab = ({
    savedAddresses,
    handleEditAddress,
    handleDeleteAddress,
    showAddressModal,
    setShowAddressModal,
    setEditingAddress,
    handleSaveAddress,
    editingAddress,
    loading,
}) => {
    const { getProvinceName, getDistrictName, getWardName, fetchDistricts, fetchWards, provinces, districts, wards } = useGHN();

    // Ensure districts and wards are loaded for all addresses (for name lookup)
    useEffect(() => {
        // Get all unique province and district IDs from addresses, parse to get only numeric IDs
        const provinceIds = Array.from(
            new Set(
                savedAddresses
                    .map((addr) => addr.city)
                    .filter(Boolean)
                    .map((city) => parseDropdownValue(city).id) // Tách lấy chỉ ID số
                    .filter(Boolean),
            ),
        );
        const districtIds = Array.from(
            new Set(
                savedAddresses
                    .map((addr) => addr.district)
                    .filter(Boolean)
                    .map((district) => parseDropdownValue(district).id) // Tách lấy chỉ ID số
                    .filter(Boolean),
            ),
        );

        // Fetch districts for all provinces
        provinceIds.forEach((pid) => {
            if (pid && !districts.some((d) => String(d.ProvinceID) === String(pid))) {
                fetchDistricts(pid); // Giờ đây truyền chỉ ID số
            }
        });
        // Fetch wards for all districts
        districtIds.forEach((did) => {
            if (did && !wards.some((w) => String(w.DistrictID) === String(did))) {
                fetchWards(did); // Giờ đây truyền chỉ ID số
            }
        });
    }, [savedAddresses]);
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">Thông tin địa chỉ</h2>
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
                        <span>Thêm địa chỉ</span>
                    </div>
                </ButtonHovCT>
            </div>
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-gray-500">Loading addresses...</div>
                ) : (
                    savedAddresses.map((address, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="flex items-center font-semibold text-gray-900">
                                        <MapPin className="mr-2 h-4 w-4 text-gray-600" />
                                        {/* {address.label || address.recipient} */} <span> Address {index + 1}</span>
                                        {(address.isDefault || address.isDeafaultAddress) && (
                                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">Default</span>
                                        )}
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                        <p className="font-bold text-gray-900">{address.fullName || address.recipient}</p>
                                        <p className="text-gray-600">{address.phone || address.phoneNumber}</p>
                                        <p className="text-gray-600">{address.address || address.addressDetailRecipient}</p>
                                        <p className="text-gray-600">
                                            <b>City:</b> {formatAddressDisplay(getProvinceName(parseDropdownValue(address.city).id))} -{" "}
                                            <b>District:</b> {formatAddressDisplay(getDistrictName(parseDropdownValue(address.district).id))} -{" "}
                                            <b>Ward:</b> {formatAddressDisplay(getWardName(parseDropdownValue(address.ward).id))}
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
                    ))
                )}
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
};

export default ProfileAddressesTab;
