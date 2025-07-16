import React from "react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { Edit3, Save, X } from "lucide-react";

const ProfileInfoTab = ({ isEditing, handleEdit, handleSubmit, onSubmit, register, errors, reset, setIsEditing }) => (
    <div>
        <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">Profile Information</h2>
            <ButtonHovCT
                onClick={handleEdit}
                bgColor={isEditing ? "bg-red-500" : "bg-black"}
                hoverBgColor={isEditing ? "bg-red-600" : "bg-white"}
                textColor="text-white"
                hoverTextColor={isEditing ? "text-white" : "text-black"}
            >
                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        <>
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                        </>
                    ) : (
                        <>
                            <Edit3 className="h-4 w-4" />
                            <span>Edit</span>
                        </>
                    )}
                </div>
            </ButtonHovCT>
        </div>

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        disabled={!isEditing}
                        className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
                            isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "border-gray-200 bg-gray-50"
                        }`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        disabled={!isEditing}
                        className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
                            isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "border-gray-200 bg-gray-50"
                        }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        {...register("phone", { required: "Phone is required" })}
                        disabled={!isEditing}
                        className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
                            isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "border-gray-200 bg-gray-50"
                        }`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                    <input
                        {...register("address", { required: "Address is required" })}
                        disabled={!isEditing}
                        className={`w-full rounded-full border px-4 py-3 transition-all duration-200 ${
                            isEditing ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" : "border-gray-200 bg-gray-50"
                        }`}
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                </div>
            </div>
            {isEditing && (
                <div className="flex justify-end space-x-4">
                    <ButtonHovCT
                        type="button"
                        onClick={() => setIsEditing(false)}
                        bgColor="bg-gray-100"
                        hoverBgColor="bg-gray-200"
                        textColor="text-gray-700"
                        hoverTextColor="text-gray-900"
                        border={false}
                    >
                        Cancel
                    </ButtonHovCT>
                    <ButtonHovCT
                        type="submit"
                        bgColor="bg-black"
                        hoverBgColor="bg-gray-800"
                        textColor="text-white"
                        hoverTextColor="text-white"
                        border={false}
                    >
                        <div className="flex items-center space-x-2">
                            <Save className="h-4 w-4" />
                            <span>Save Changes</span>
                        </div>
                    </ButtonHovCT>
                </div>
            )}
        </form>
    </div>
);

export default ProfileInfoTab;
