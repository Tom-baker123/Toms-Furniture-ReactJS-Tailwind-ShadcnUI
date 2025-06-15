import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import { createSize, updateSize } from "@/api/api";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";

const SizeForm = () => {
  const navigate = useNavigate();
  const sizeData = useLoaderData();
  const isEditing = !!sizeData;
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: isEditing
      ? {
          SizeName: sizeData.sizeName || "",
          IsActive: sizeData.isActive ?? true,
        }
      : {
          SizeName: "",
          IsActive: true,
        },
  });

  useEffect(() => {
    if (isEditing) {
      reset({
        SizeName: sizeData.sizeName,
        IsActive: sizeData.isActive,
      });
    }
  }, [sizeData, reset]);

  const onSubmit = async (data) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isEditing) {
        // Ensure payload matches SizeUpdateVModel
        const payload = {
          Id: sizeData.id,
          SizeName: data.SizeName,
          IsActive: data.IsActive,
        };
        await updateSize(payload);
        toast.success("Size updated successfully!");
      } else {
        await createSize(data);
        toast.success("Size created successfully!");
      }
      navigate("/admin/sizes");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate("/admin/sizes")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <MoveLeft className="mr-2 h-5 w-5" />
          Back
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <div className="flex justify-between">
          <div className="title text-2xl font-bold text-slate-800">
            {isEditing ? "Update Size" : "Add New Size"}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-sm transition-all hover:bg-blue-700 ${
              isSubmitting || isLoading ? "opacity-50" : ""
            }`}
          >
            {isSubmitting || isLoading ? "Processing..." : isEditing ? "Update" : "Create Size"}
          </button>
        </div>
        <div className="h-fit w-full overflow-hidden rounded-sm bg-white shadow-xs">
          <div className="p-4 text-lg font-bold text-slate-800">Size Information</div>
          <hr />
          <div className="flex flex-col gap-5 px-4 py-4">
            <label className="font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <p className="text-md">Size Name</p>
              </span>
              <Controller
                name="SizeName"
                control={control}
                rules={{
                  required: "Size name is required",
                  maxLength: {
                    value: 50,
                    message: "Size name must be less than 50 characters",
                  },
                }}
                render={({ field }) => (
                  <input
                    type="text"
                    className={`mt-2 w-full rounded-sm border px-1.5 py-2 ${errors.SizeName ? "border-red-500" : ""}`}
                    placeholder="Enter size name"
                    {...field}
                  />
                )}
              />
              {errors.SizeName && <p className="mt-1 text-sm text-red-500">{errors.SizeName.message}</p>}
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
                      value={field.value.toString()}
                      onChange={(e) => field.onChange(e.target.value === "true")}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  )}
                />
              </label>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SizeForm;