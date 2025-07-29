import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createRoomType, updateRoomType } from "@/api/service/RoomTypeService";
import { MoveLeft, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const RoomTypeForm = () => {
    const navigate = useNavigate();
    const roomTypeData = useLoaderData();
    const isEditing = !!(roomTypeData && Object.keys(roomTypeData).length > 0);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  RoomTypeName: roomTypeData.roomTypeName || "",
                  IsActive: roomTypeData.isActive ?? true,
              }
            : {
                  RoomTypeName: "",
                  IsActive: true,
              },
    });

    const [imagePreview, setImagePreview] = useState(roomTypeData?.imageUrl || null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (isEditing) {
            reset({
                RoomTypeName: roomTypeData.roomTypeName,
                IsActive: roomTypeData.isActive,
            });
            setImagePreview(roomTypeData.imageUrl);
        }
    }, [roomTypeData, reset]);

    const handleImageChange = (e, onChange) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            onChange(file);
        }
    };

    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            if (isEditing) {
                await updateRoomType({ Id: roomTypeData.id, ...data }, imageFile);
                toast.success("Room type updated successfully!");
            } else {
                await createRoomType(data, imageFile);
                toast.success("Room type created successfully!");
            }
            navigate("/admin/room_types");
        } catch (error) {
            toast.error(`Error: ${error.message || error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            {/* Nút quay lại */}
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/room_types")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Back
                </button>
            </div>
            {/* Form thêm/sửa loại phòng */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col-reverse gap-y-6"
            >
                <div className="grid grid-cols-12 gap-4">
                    {/* Phần upload hình ảnh */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-4">
                        <div className="p-4 text-lg font-bold text-slate-800">
                            Room Type Image <span className="text-lg text-gray-500">(optional)</span>
                        </div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <Controller
                                name="imageFile"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border bg-gray-50 p-2 transition outline-dashed hover:bg-gray-100">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-32 w-32 rounded object-cover"
                                            />
                                        ) : (
                                            <>
                                                <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                                                <span className="text-sm text-gray-500">Select image</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.gif,.webp"
                                            onChange={(e) => handleImageChange(e, onChange)}
                                        />
                                    </label>
                                )}
                            />
                        </div>
                    </div>
                    {/* Phần thông tin loại phòng */}
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-8">
                        <div className="p-4 text-lg font-bold text-slate-800">Room Type Information</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            {/* Tên loại phòng */}
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Room Type Name</p>
                                </span>
                                <Controller
                                    name="RoomTypeName"
                                    control={control}
                                    rules={{
                                        required: "Room type name is required",
                                        maxLength: {
                                            value: 100,
                                            message: "Room type name must be less than 100 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.RoomTypeName ? "border-red-500" : ""}`}
                                            placeholder="Enter room type name"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.RoomTypeName && <p className="mt-1 text-sm text-red-500">{errors.RoomTypeName.message}</p>}
                            </label>

                            {/* Trạng thái (chỉ hiển thị khi sửa) */}
                            {isEditing && (
                                <label className="font-bold text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <p className="text-md">Status</p>
                                    </span>
                                    <Controller
                                        name="IsActive"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="mt-2 w-full rounded-sm border px-1.5 py-2"
                                                {...field}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        )}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
                {/* Tiêu đề và nút submit */}
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Update Room Type" : "Add New Room Type"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Room Type"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoomTypeForm;
