import React, { useState } from "react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { useModal } from "@/context/ModalContext";
import { verifyOtp, resendOtp } from "@/api/api";
import { toast } from "react-hot-toast";

export const VerifyOtpForm = ({ email }) => {
    // [1.] Lưu mã otp
    const [otp, setOtp] = useState("");
    // [2.] quản lý trạng thái đóng mở modal
    const { closeModal } = useModal();

    // [3.] hàm xử lý xác thực
    const handleVerify = async (e) => {
        e.preventDefault();
        const result = await verifyOtp(email, otp);
        if (result.message === "Kích hoạt tài khoản thành công.") {
            toast.success("Activate account successed!");
            closeModal();
            window.location.reload(); // Tải lại trang để update form
        } else {
            toast.error(result.message);
        }
    };

    // [4.] Hàm xử lý gửi lại
    const handleResend = async () => {
        const result = await resendOtp(email);
        if (result.message === "Gửi mã OTP mới thành công. Vui lòng kiểm tra email của bạn.") {
            toast.success("We just sent a new code!");
        } else {
            toast.error(result.message);
        }
    };

    return (
        <>
            <div className="my-5 flex flex-col">
                <h2 className="text-center text-2xl font-bold lg:text-3xl">Verify OTP</h2>
                <p className="text-md mt-3 text-center font-semibold text-gray-500">Enter the OTP sent to {email}</p>
                <form
                    className="mt-6 flex flex-col"
                    onSubmit={handleVerify}
                >
                    <div className="Form-Field">
                        <label className="Form-Label">OTP</label>
                        <input
                            className="block h-12 w-full rounded-full bg-gray-200 px-5 text-lg"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            required
                        />
                    </div>
                    <ButtonHovCT
                        className={"mt-8 !border-black"}
                        bgColor="bg-black"
                        hoverBgColor="bg-white"
                        textColor="text-white"
                        type="submit"
                    >
                        Verify OTP
                    </ButtonHovCT>
                </form>
                <button
                    onClick={handleResend}
                    className="mt-4 text-center font-semibold text-gray-500 underline"
                >
                    Resend OTP
                </button>
            </div>
        </>
    );
};
