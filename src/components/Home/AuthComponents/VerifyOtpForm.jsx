import React, { useEffect, useRef, useState } from "react";
import ButtonHovCT from "@/components/tailwind-custom/ButtonHovCT";
import { useModal } from "@/context/ModalContext";
import { verifyOtp, resendOtp } from "@/api/api";
import { toast } from "react-hot-toast";

export const VerifyOtpForm = ({ email }) => {
    const OTP_LENGTH = 6;
    const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(60);
    const inputsRef = useRef([]);
    const { closeModal } = useModal();

    // Countdown timer
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    // Handle OTP input change
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // Only allow numbers

        const newOtp = [...otpDigits];
        newOtp[index] = value.slice(-1); // Only keep the last digit
        setOtpDigits(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1].focus(); // Move to next input
        }
    };

    // Handle backspace to focus previous input
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

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

    const handleVerify = async (e) => {
        e.preventDefault();
        const otp = otpDigits.join("");
        if (otp.length < OTP_LENGTH) {
            toast.error("Please enter the full OTP.");
            return;
        }

        setIsVerifying(true);
        const result = await verifyOtp(email, otp);
        setIsVerifying(false);

        if (result.message === "Kích hoạt tài khoản thành công.") {
            toast.success("Account activated successfully!");
            closeModal();
            window.location.reload();
        } else {
            toast.error(result.message);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setIsResending(true);
        const result = await resendOtp(email);
        setIsResending(false);

        if (result.message === "Gửi mã OTP mới thành công. Vui lòng kiểm tra email của bạn.") {
            toast.success("A new OTP has been sent to your email.");
            setOtpDigits(Array(OTP_LENGTH).fill(""));
            setTimer(60);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="my-6 flex flex-col items-center">
            <h2 className="text-center text-2xl font-bold lg:text-3xl">Verify OTP</h2>
            <p className="text-md mt-2 text-center text-gray-500 font-semibold">
                Enter the 6-digit OTP sent to <span className="text-black">{email}</span>
            </p>
            <form className="mt-6 flex flex-col items-center" onSubmit={handleVerify}>
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
                            className="w-12 h-12 rounded-lg text-center text-2xl border border-gray-400 focus:outline-black bg-gray-100"
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
            <div className="mt-4 text-center">
                {timer > 0 ? (
                    <p className="text-gray-500">Resend available in <strong>{timer}s</strong></p>
                ) : (
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-gray-500 underline font-semibold"
                    >
                        {isResending ? "Sending..." : "Resend OTP"}
                    </button>
                )}
            </div>
        </div>
    );
};
