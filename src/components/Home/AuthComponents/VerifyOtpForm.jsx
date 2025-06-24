// src/components/Home/AuthComponents/VerifyOtpForm.jsx
import React, { useEffect, useRef, useState } from "react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export const VerifyOtpForm = ({ email, context = "register" }) => {
    const OTP_LENGTH = 6;
    // Trạng thái để quản lý các chữ số OTP
    const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
    // Trạng thái để kiểm soát khi đang xác thực
    const [isVerifying, setIsVerifying] = useState(false);
    // Trạng thái để kiểm soát khi đang gửi lại OTP
    const [isResending, setIsResending] = useState(false);
    // const [timer, setTimer] = useState(0); // 🛠 Ban đầu không đếm ngược
    const [timer, setTimer] = useState(60); // 🛠 Ban đầu không đếm ngược
    const inputsRef = useRef([]);
    const { handleVerifyOtp, handleResendOtp } = useAuth();

    // ⏳ Countdown chỉ chạy nếu timer > 0
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    // ✍️ Nhập từng số
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // Chỉ cho phép số

        const newOtp = [...otpDigits];
        newOtp[index] = value.slice(-1);
        setOtpDigits(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    // ⬅️ Lùi lại khi bấm Backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    // 📋 Dán nguyên dãy số vào
    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        const newOtp = Array(OTP_LENGTH).fill("");
        for (let i = 0; i < pasted.length; i++) {
            newOtp[i] = pasted[i];
        }
        setOtpDigits(newOtp);
        if (pasted.length < OTP_LENGTH) {
            inputsRef.current[pasted.length]?.focus();
        } else {
            inputsRef.current[OTP_LENGTH - 1]?.focus();
        }
    };

    // ✅ Gửi OTP để xác minh
    const handleVerify = async (e) => {
        e.preventDefault();
        const otp = otpDigits.join("");
        if (otp.length < OTP_LENGTH) {
            toast.error("Please enter the full OTP.");
            return;
        }

        setIsVerifying(true);
        await handleVerifyOtp(email, otp, context);
        setIsVerifying(false);
    };

    // 🔄 Gửi lại OTP và bắt đầu đếm ngược
    const handleResend = async () => {
        if (timer > 0) return;

        setIsResending(true);
        const result = await handleResendOtp(email);
        if (result?.success) {
            setOtpDigits(Array(OTP_LENGTH).fill(""));
            setTimer(60);
        }
        setIsResending(false);
    };

    return (
        <div className="my-6 flex flex-col items-center">
            {/* Tiêu đề */}
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Verify OTP</h2>
            <p className="text-md mt-2 text-center font-semibold text-gray-500">
                Enter the 6-digit OTP sent to <span className="text-black">{email}</span>
            </p>

            {/* Form nhập OTP */}
            <form
                className="mt-6 flex flex-col items-center"
                onSubmit={handleVerify}
            >
                <div
                    className="flex gap-3"
                    onPaste={handlePaste}
                >
                    {otpDigits.map((digit, idx) => (
                        <input
                            key={idx}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="h-12 w-12 rounded-lg border border-gray-400 bg-gray-100 text-center text-2xl focus:outline-black"
                            value={digit}
                            onChange={(e) => handleChange(e, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            ref={(el) => (inputsRef.current[idx] = el)}
                        />
                    ))}
                </div>
                <ButtonHovCT
                    className="mt-6 w-full !border-black"
                    bgColor="bg-black"
                    hoverBgColor="bg-white"
                    textColor="text-white"
                    type="submit"
                    disabled={isVerifying}
                >
                    {isVerifying ? "Verifying..." : "Verify OTP"}
                </ButtonHovCT>
            </form>

            {/* 🔄 Hiển thị thông báo hoặc nút resend */}
            <div className="mt-4 text-center">
                {timer > 0 ? (
                    <p className="text-gray-500">
                        Resend available in <strong>{timer}s</strong>
                    </p>
                ) : (
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="font-semibold text-gray-500 underline"
                    >
                        {isResending ? "Sending..." : "Resend OTP"}
                    </button>
                )}
            </div>
        </div>
    );
};
