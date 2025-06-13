import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createBrand, updateBrand } from "@/api/api";
import { MoveLeft, Image as ImageIcon, CircleHelp } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import toast from "react-hot-toast";

const BrandForm = () => {
    const navigate = useNavigate();
    const brandData = useLoaderData();
    const isEditing = !!brandData;
    const [isLoading, setIsLoading] = useState(false); // Thêm state

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: isEditing
            ? {
                  BrandName: brandData.brandName || "",
                  IsActive: brandData.isActive || true,
              }
            : {
                  BrandName: "",
                  IsActive: true,
              },
    });

    const [imagePreview, setImagePreview] = useState(brandData?.imageUrl || null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (isEditing) {
            reset({
                BrandName: brandData.brandName,
                IsActive: brandData.isActive,
            });
            setImagePreview(brandData.imageUrl);
        }
    }, [brandData, reset]);

    const handleImageChange = (e, onChange) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            onChange(file);
        }
    };

    const onSubmit = async (data) => {
        if (isLoading) return; // Ngăn gửi lại yêu cầu
        setIsLoading(true);
        try {
            if (isEditing) {
                await updateBrand({ Id: brandData.id, ...data }, imageFile);
                toast.success("Brand updated successfully!");
            } else {
                await createBrand(data, imageFile);
                toast.success("Brand created successfully!");
            }
            navigate("/admin/brands");
        } catch (error) {
            console.log("Toast error triggered:", error.message);
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <div className="mb-4 flex items-center gap-2">
                <button
                    onClick={() => navigate("/admin/brands")}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <MoveLeft className="mr-2 h-5 w-5" />
                    Back
                </button>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col-reverse gap-y-6"
            >
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-4">
                        <div className="p-4 text-lg font-bold text-slate-800">
                            Brand Image <span className="text-lg text-gray-500">(optional)</span>
                        </div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <div>
                                <Controller
                                    name="imageFile"
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border bg-gray-50 p-2 transition outline-dashed hover:bg-gray-100">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
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
                    </div>
                    <div className="col-span-12 h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs md:col-span-8">
                        <div className="p-4 text-lg font-bold text-slate-800">Brand Information</div>
                        <hr />
                        <div className="flex flex-col gap-5 px-4 py-4">
                            <label className="font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                    <p className="text-md">Brand Name</p>
                                </span>
                                <Controller
                                    name="BrandName"
                                    control={control}
                                    rules={{
                                        required: "Brand name is required",
                                        maxLength: {
                                            value: 100,
                                            message: "Brand name must be less than 100 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.BrandName ? "border-red-500" : ""}`}
                                            placeholder="Enter brand name"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.BrandName && <p className="mt-1 text-sm text-red-500">{errors.BrandName.message}</p>}
                            </label>
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
                <div className="flex justify-between">
                    <div className="title text-2xl font-bold text-slate-800">{isEditing ? "Update Brand" : "Add New Brand"}</div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
                            isSubmitting || isLoading ? "opacity-50" : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Brand"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BrandForm;
